# Party RSVP website

## Setup
1. Create a free Supabase project.
2. Open **SQL Editor**, paste `schema.sql`, and run it. If the last publication command says the table is already a member, that's fine; don't rerun it.
3. In Supabase **Project Settings → API**, copy the **Project URL** and **publishable key** (or legacy `anon` key) into `config.js`. Never use a secret or service_role key.
4. Create a **public** GitHub repository named `party-invite` and upload `index.html`, `style.css`, `script.js`, and `config.js`. (You can also upload this README and schema.sql.)
5. In GitHub repository **Settings → Pages**, choose **Deploy from a branch**, `main`, `/ (root)`, and Save.
6. Visit `https://YOUR_USERNAME.github.io/party-invite/` once GitHub finishes deploying.

## Important limitations
- This is a simple **public** RSVP board: names, status, and plus-one counts are visible to anyone who visits the link. Only request data guests agree to make public.
- Anyone can submit a name, including duplicate or fake names. There is no identity verification, editing, or anti-spam protection. For a larger/public event, add authentication, CAPTCHA, rate limiting, and an admin moderation workflow.
- GitHub Pages is static hosting; Supabase provides the shared database and realtime updates. The public publishable key is safe to expose *only with appropriate Row Level Security policies*.
- The guest list is capped at the first 1000 records in this starter. For a larger party, add pagination.
- If Realtime publication is unavailable, the guest list still refreshes every 15 seconds.
