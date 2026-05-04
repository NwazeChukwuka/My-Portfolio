# Mazi Chukwuka | Professional Portfolio

A multi-disciplinary digital portfolio showcasing the intersection of **Chartered Accountancy**, **Full-Stack Development**, and **Data Analytics**. This platform serves as a central hub for professional projects, technical case studies, and research publications.

##  Key Features
*   **Role-Based Content:** Dynamic sections for Accounting, Web Development, and Data Analytics.
*   **Smart Assistant:** Integrated AI-driven component for interactive user engagement.
*   **Modern Performance:** Optimized imagery (WebP) and fast routing for a seamless UX.
*   **Case Study Modules:** Detailed breakdowns of professional projects and research papers.

##  Tech Stack
*   **Frontend:** React.js, Vite
*   **Styling:** Modular CSS, Lucide Icons
*   **Backend/Database:** Supabase (PostgreSQL)
*   **State & Logic:** Custom React Hooks and Content Mappers

##  Project Structure
```text
├── public/assets/      # Optimized media assets
├── src/
│   ├── components/     # UI and Layout components
│   ├── hooks/          # Content and site logic
│   ├── lib/            # API engines and utility functions
│   ├── pages/          # Individual role and case study views
│   └── data/           # Personal data and schemas
└── supabase/           # SQL migrations and seed data
```

## Admin Auth Setup

1. Run `supabase/01_schema_and_policies.sql` in Supabase SQL Editor.
2. Run `supabase/02_seed_data.sql`.
3. Open `/admin/setup` on your deployed app and create your account (this creates a profile with role `member`).
4. In `supabase/02_seed_data.sql`, set your email in the `update public.profiles ... where email = '...'` line and run it to promote yourself to `admin`.
5. Confirm email (if enabled), then sign in at `/admin/login`.

### Magic Link

`Send Magic Link` sends a one-time sign-in link to your email. Clicking it signs you in without entering a password.

### Forgot/Reset Password

Use `Forgot Password / Reset Password` on `/admin/login`. Supabase emails a secure reset link that opens `/admin/reset-password`, where you set a new password.