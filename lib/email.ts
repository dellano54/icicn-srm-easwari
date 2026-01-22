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
                headerGradient: 'linear-gradient(135deg, #065f46 0%, #059669 100%)', // Emerald 800 to 600
                icon: '✅',
                accentColor: '#059669'
            };
        case 'danger':
            return {
                headerGradient: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)', // Red 800 to 600
                icon: '⚠️',
                accentColor: '#dc2626'
            };
        case 'warning':
            return {
                headerGradient: 'linear-gradient(135deg, #92400e 0%, #d97706 100%)', // Amber 800 to 600
                icon: '🔔',
                accentColor: '#d97706'
            };
        case 'default':
        default:
            return {
                headerGradient: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)', // Slate 800 to Blue 500
                icon: '📬',
                accentColor: '#2563eb'
            };
    }
};

const getHtmlTemplate = (title: string, bodyContent: string, variant: EmailVariant = 'default') => {
  const styles = getVariantStyles(variant);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        body { 
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            background-color: #f8fafc; 
            margin: 0; 
            padding: 0; 
            -webkit-font-smoothing: antialiased;
            color: #334155;
        }
        .wrapper {
            width: 100%;
            background-color: #f8fafc;
            padding: 40px 0;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 24px; 
            overflow: hidden; 
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border: 1px solid #e2e8f0;
        }
        .header { 
            background: ${styles.headerGradient}; 
            padding: 48px 40px; 
            text-align: center; 
            position: relative;
        }
        .header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
        }
        .logo-text {
            color: #ffffff;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.03em;
            margin: 0;
            line-height: 1;
        }
        .logo-sub {
            color: rgba(255, 255, 255, 0.8);
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-top: 12px;
        }
        .content { 
            padding: 48px 40px; 
            font-size: 16px; 
            line-height: 1.8;
            color: #475569;
        }
        .content h1, .content h2, .content h3 { 
            color: #0f172a; 
            font-weight: 700; 
            margin-top: 0;
            letter-spacing: -0.02em;
        }
        .content h2 { font-size: 24px; margin-bottom: 16px; }
        .content p { margin-bottom: 24px; }
        
        /* Highlight Box */
        .highlight-box { 
            background: #f1f5f9; 
            border-left: 4px solid ${styles.accentColor};
            border-radius: 8px; 
            padding: 24px; 
            margin: 32px 0; 
        }
        .highlight-box strong { 
            display: block; 
            color: #0f172a; 
            font-size: 14px; 
            text-transform: uppercase; 
            letter-spacing: 0.05em; 
            margin-bottom: 8px;
        }
        .highlight-box ul { margin: 0; padding-left: 20px; }
        .highlight-box li { margin-bottom: 8px; }

        /* Button */
        .btn { 
            display: inline-block; 
            background: ${styles.accentColor}; 
            color: #ffffff !important; 
            padding: 16px 32px; 
            border-radius: 99px; 
            text-decoration: none; 
            font-weight: 600; 
            margin-top: 16px; 
            text-align: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-1px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        
        .footer { 
            background: #f8fafc; 
            padding: 40px; 
            text-align: center; 
            font-size: 13px; 
            color: #94a3b8; 
            border-top: 1px solid #e2e8f0; 
        }
        .footer p { margin: 4px 0; }
        .footer a { color: #64748b; text-decoration: none; font-weight: 500; }
        .footer a:hover { color: ${styles.accentColor}; }
        
        /* Utilities */
        .text-sm { font-size: 14px; }
        .text-center { text-align: center; }
        .mb-0 { margin-bottom: 0; }
      </style>
    </head>
    <body>
      <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1 class="logo-text">ICCICN '26</h1>
              <p class="logo-sub">International Conference on Computational Intelligence</p>
            </div>
            <div class="content">
              ${bodyContent}
            </div>
            <div class="footer">
              <p>&copy; 2026 ICCICN. All rights reserved.</p>
              <p>Easwari Engineering College, Chennai, India.</p>
              <div style="margin-top: 16px;">
                <a href="#">Help Center</a> &bull; <a href="#">Privacy Policy</a> &bull; <a href="#">Unsubscribe</a>
              </div>
            </div>
          </div>
      </div>
    </body>
    </html>
  `;
};

export const sendEmail = async (to: string, subject: string, htmlBody: string, variant: EmailVariant = 'default') => {
  try {
    // Extract title from h1 if present, or use subject
    const titleMatch = htmlBody.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1] : subject;
    
    // Remove the h1 from body if we extracted it, to avoid duplication in template
    // Also replacing generic H2s with the styled ones
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
