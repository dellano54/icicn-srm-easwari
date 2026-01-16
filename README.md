# ICCICN '26 Registration Portal

The official registration and conference management portal for the **International Conference on Computational Intelligence & Computer Networks (ICCICN '26)**.

This full-stack application manages the entire lifecycle of a conference submission: from team registration and paper upload to peer review, acceptance, payment verification, and final registration.

## 🚀 Features

### 👥 User Portal
*   **Team Registration:** Dynamic form to handle team details, multiple members, and domain selection.
*   **Secure Uploads:** Integration with **Vercel Blob** for Research Papers (PDF) and Plagiarism Reports.
*   **Real-time Dashboard:** Visual status tracker (Submitted → Under Review → Accepted/Rejected).
*   **Payment Integration:** QR Code display for accepted papers and screenshot upload for verification.
*   **Automated Emails:** Confirmation emails with login credentials (Team ID).

### 👨‍🏫 Reviewer Portal
*   **Automated Assignment:** Papers are automatically assigned to 3 qualified reviewers based on matching domain tags.
*   **Review Interface:** View papers, submit feedback, decisions (Accept/Reject), and assign Tiers (1, 2, 3).
*   **Real-time Consensus:** Reviewers can see the anonymous voting status of other reviewers (Accept/Reject counts) in real-time.
*   **Consensus Logic:** Automatically moves a paper to "Awaiting Decision" status when it receives 2 "Accept" or 2 "Reject" votes, triggering Admin review.

### 🛡️ Admin Portal
*   **Dashboard Stats:** Overview of total submissions, acceptance rates, and revenue.
*   **Decision Making:** Final "Accept" or "Reject" authority. Rejection triggers data cleanup (file deletion).
*   **Payment Verification:** View payment screenshots and approve registrations.

## 🛠️ Tech Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Language:** TypeScript
*   **Database:** PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
*   **Storage:** [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Authentication:** Custom JWT Session-based Auth (`jose`)
*   **Email:** Nodemailer (SMTP)

## ⚙️ Prerequisites

*   Node.js 18+
*   PostgreSQL Database (Local or Cloud like Neon/Vercel Postgres)
*   Vercel Account (for Blob Storage)
*   SMTP Credentials (e.g., Gmail App Password)

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/icicn-portal.git
    cd icicn-portal
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory and add the following:
    ```env
    # Database (PostgreSQL connection string)
    DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

    # Vercel Blob (Storage)
    BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

    # Email Service (Gmail SMTP)
    SMTP_EMAIL="your-email@gmail.com"
    SMTP_PASSWORD="your-app-specific-password"

    # Security
    JWT_SECRET="your-super-secret-random-key"
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ```

4.  **Database Setup**
    Push the schema to your database:
    ```bash
    npx prisma db push
    ```

5.  **Seed Data**
    Initialize the database with Admin and Reviewer accounts:
    ```bash
    npx tsx prisma/seed.ts
    ```

6.  **Run the Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Default Credentials (from Seed)

### System Login: `/system/login`

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@icicn.org` | `admin-secure-password` |
| **Reviewers** | `reviewer-[domain-slug]-[1-3]@icicn.org` | `password123` |

*Example:* `reviewer-artificial-intelligence-1@icicn.org`

### User Login: `/login`

*   **Credentials are generated upon registration.**
*   Check your console (or email inbox) after registering a team at `/register` to get the **Team ID** and **Access Code**.

## 📖 Project Structure

```
├── app/
│   ├── actions/       # Server Actions (Backend Logic)
│   ├── admin/         # Admin Portal Routes
│   ├── dashboard/     # User Dashboard
│   ├── login/         # User Login
│   ├── register/      # Registration Form
│   ├── reviewer/      # Reviewer Portal Routes
│   └── system/        # Admin/Reviewer Login
├── components/
│   ├── landing/       # Landing Page Components
│   ├── register/      # Registration Specific Components
│   └── ui/            # Reusable UI Components
├── lib/
│   ├── prisma.ts      # DB Client
│   ├── session.ts     # Auth Logic
│   └── email.ts       # Email Service
└── prisma/
    ├── schema.prisma  # Database Schema
    └── seed.ts        # Initial Data Script
```

## 🔒 Security

*   **Password Hashing:** All Team Access Codes and System Passwords are hashed using `bcryptjs`.
*   **Role-Based Access Control (RBAC):** Middleware/Session checks ensure users cannot access Admin/Reviewer routes.
*   **Secure Cookies:** HTTP-only cookies are used for session management.

## 📄 License

This project is licensed under the MIT License.