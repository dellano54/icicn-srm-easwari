# ICCICN '26 Registration Portal

The official registration and conference management portal for the **International Conference on Computational Intelligence & Computer Networks (ICCICN '26)**.

This full-stack application manages the entire lifecycle of a conference submission: from team registration and paper upload to peer review, acceptance, payment verification, and final registration.

## 🚀 Features

### 👥 User Portal
*   **Team Registration:** Dynamic form to handle team details, multiple members (max 4), and domain selection.
*   **Secure Uploads:** Integration with **Vercel Blob** for Research Papers (PDF) and Plagiarism Reports.
*   **Real-time Dashboard:** Visual status tracker (Submitted → Under Review → Accepted/Rejected).
*   **Payment Integration:** QR Code display for accepted papers and screenshot upload for verification.
*   **Automated Emails:** Confirmation emails with login credentials (Team ID & Access Code).

### 👨‍🏫 Reviewer Portal
*   **Automated Assignment:** Papers are automatically assigned to **3 qualified reviewers** based on matching domain tags upon registration.
*   **Review Interface:** View papers (PDF) and plagiarism reports, submit structured feedback, and assign Tiers (1, 2, 3).
*   **Engagement Tracking:** "Viewed" status timestamp updates automatically when a reviewer opens a paper.
*   **Real-time Consensus:** Reviewers can see the anonymous voting status (Accept/Reject counts) of peer reviewers.
*   **Consensus Logic:** System automatically promotes a paper to "Awaiting Decision" when it reaches **2 matching votes**.

### 🛡️ Admin Portal
*   **Analytics Dashboard:**
    *   **KPI Cards:** Total Submissions, Accepted, Registered, Rejected.
    *   **Domain Stats:** Breakdown of submissions by research domain.
    *   **Reviewer Stats:** Track workload (Total/Completed/Pending) per reviewer.
*   **Bulk Actions:**
    *   **Pending Decisions:** Bulk Accept (Tier 1 default) or Reject papers based on reviewer consensus.
    *   **Payment Verification:** Bulk approve payment screenshots.
*   **Advanced Sorting:** Sort pending papers by "Recommended Tier" to prioritize high-quality research.
*   **Detailed Insights:** Hover tooltips to read raw reviewer feedback directly in the table.

## 🛠️ Tech Stack

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Server Actions)
*   **Language:** TypeScript
*   **Database:** PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
*   **Storage:** [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Authentication:** Custom JWT Session-based Auth (`jose`)
*   **Email:** Nodemailer (SMTP)

## ⚙️ Prerequisites

*   Node.js 18+
*   PostgreSQL Database (Local or Cloud like Neon/Vercel Postgres)
*   Vercel Account (for Blob Storage token)
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
    Create a `.env` file in the root directory:
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
    *This generates 54 reviewers (3 per domain) and 1 admin.*

6.  **Run the Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## 🔑 System Accounts

A full list of generated accounts is available in the `REVIEWER_ACCOUNTS.md` file after seeding.

### **System Login:** `/system/login`

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@icicn.org` | `admin-secure-password` |
| **Reviewer** | `reviewer-3d-printing-1@icicn.org` | `password123` |
| **Reviewer** | `reviewer-cyber-security-1@icicn.org` | `password123` |
| *...and 50+ more* | *(Check REVIEWER_ACCOUNTS.md)* | |

### **User Login:** `/login`

*   **Credentials are generated upon registration.**
*   Register a new team at `/register`.
*   Check your **Email Inbox** (or server console logs if email fails) for the **Team ID** and **Access Code**.

## 📖 Project Structure

```
├── app/
│   ├── actions/       # Server Actions (Backend Logic: Auth, Register, Review, Admin)
│   ├── admin/         # Admin Dashboard Pages
│   ├── dashboard/     # User Dashboard Pages
│   ├── login/         # User Login Page
│   ├── register/      # Registration Form Page
│   ├── reviewer/      # Reviewer Dashboard Pages
│   └── system/        # Admin/Reviewer Login Page
├── components/
│   ├── admin/         # Admin Tables (Bulk Actions, Sortable Columns)
│   ├── landing/       # Landing Page UI (Hero, About, Marquee)
│   ├── reviewer/      # Reviewer Components (ReviewLink)
│   └── ui/            # Reusable UI (Inputs, FileUpload, DomainSelector)
├── lib/
│   ├── api.ts         # Mock External APIs (College/Location Search)
│   ├── logic.ts       # Core Business Logic (Reviewer Assignment)
│   └── prisma.ts      # Database Client Singleton
└── prisma/
    ├── schema.prisma  # Database Schema
    └── seed.ts        # Database Seeder Script
```

## 🔒 Security

*   **Password Hashing:** Team Access Codes are hashed using `bcryptjs`.
*   **Role-Based Access Control (RBAC):** Strict session checks (`admin`, `reviewer`, `user`) on all protected routes and actions.
*   **Secure Cookies:** HTTP-only cookies prevent client-side script access.

## 📄 License

This project is licensed under the MIT License.
