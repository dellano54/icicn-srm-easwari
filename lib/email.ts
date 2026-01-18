import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

type EmailVariant = 'default' | 'success' | 'danger' | 'warning';

const getVariantStyles = (variant: EmailVariant) => {
    switch (variant) {
        case 'success':
            return {
                gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                subtextColor: '#d1fae5',
                btnColor: '#059669'
            };
        case 'danger':
            return {
                gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                subtextColor: '#fee2e2',
                btnColor: '#dc2626'
            };
        case 'warning':
            return {
                gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                subtextColor: '#fef3c7',
                btnColor: '#d97706'
            };
        case 'default':
        default:
            return {
                gradient: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                subtextColor: '#94a3b8',
                btnColor: '#2563eb'
            };
    }
};

const getHtmlTemplate = (title: string, bodyContent: string, variant: EmailVariant = 'default') => {
  const styles = getVariantStyles(variant);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: 'Plus Jakarta Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .header { background: ${styles.gradient}; padding: 40px 30px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; color: #ffffff; }
        .header p { margin: 8px 0 0; color: ${styles.subtextColor}; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.9; }
        .content { padding: 40px 30px; color: #334155; line-height: 1.7; font-size: 16px; }
        .content h2 { color: #0f172a; font-weight: 700; font-size: 20px; margin-top: 0; }
        .footer { background: #f8fafc; padding: 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .footer a { color: #3b82f6; text-decoration: none; }
        .highlight-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 25px 0; }
        .highlight-box strong { display: block; margin-bottom: 10px; color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
        .highlight-box ul { margin: 0; padding-left: 20px; color: #475569; }
        .highlight-box li { margin-bottom: 5px; }
        .btn { display: inline-block; background: ${styles.btnColor}; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; margin-top: 25px; text-align: center; }
        .btn:hover { opacity: 0.9; }
        .tag { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; background: #e2e8f0; color: #475569; margin-left: 5px; vertical-align: middle; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ICCICN '26</h1>
          <p>International Conference on Computational Intelligence</p>
        </div>
        <div class="content">
          ${bodyContent}
        </div>
        <div class="footer">
          <p>&copy; 2026 ICCICN. All rights reserved.</p>
          <p>Easwari Engineering College, Chennai, India.</p>
          <p><a href="#">Contact Support</a> | <a href="#">Website</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendEmail = async (to: string, subject: string, htmlBody: string, variant: EmailVariant = 'default') => {
  try {
    // Wrap the body in the standard template
    // Extract title from h1 if present, or use subject
    const titleMatch = htmlBody.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1] : subject;
    // Remove the h1 from body if we extracted it, to avoid duplication in template
    const cleanBody = htmlBody.replace(/<h1[^>]*>.*?<\/h1>/i, `<h2>${title}</h2>`);

    const finalHtml = getHtmlTemplate(title, cleanBody, variant);

    await transporter.sendMail({
      from: `"ICCICN '26" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html: finalHtml,
    });
    console.log(`Email sent to ${to} [Variant: ${variant}]`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};