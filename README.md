# LogiCore Club — Website

A production-quality website for **LogiCore Club**, the mathematics and programming student club at the Faculty of Exact Sciences (FSE), Djillali Liabes University (UDL), Sidi Bel Abbès, Algeria.

**Stack:** React 18 + TypeScript · Vite · Tailwind CSS · Supabase · React Router v6 · react-hook-form + Zod · Framer Motion · Lucide

---

## Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable primitives: Button, Input, Textarea, Select, Badge, Card, Modal, Toast, Skeleton, EmptyState, Tabs
│   ├── layout/      # Navbar, Footer, PublicLayout, MathBackground, SetupPage
│   ├── events/      # EventCard
│   └── admin/       # AdminLayout, EventFormModal, ArchiveEventModal
├── pages/
│   ├── HomePage.tsx
│   ├── EventsPage.tsx
│   ├── EventDetailPage.tsx
│   ├── AboutPage.tsx
│   ├── JoinPage.tsx
│   ├── ContactPage.tsx
│   ├── NotFoundPage.tsx
│   └── admin/
│       ├── AdminLoginPage.tsx
│       ├── AdminEventsPage.tsx
│       └── AdminRequestsPage.tsx
├── lib/
│   ├── supabase.ts       # Supabase client
│   └── api/
│       ├── events.ts     # Data-access layer for events
│       └── requests.ts   # Data-access layer for join requests
├── hooks/
│   ├── useAuth.ts
│   ├── useAsync.ts
│   └── useDebounce.ts
├── types/index.ts        # All TypeScript types
├── constants/index.ts    # Club info, stats, nav links (easy to edit)
├── utils/
│   ├── format.ts         # Date/time formatting helpers
│   └── validation.ts     # Zod schemas
├── App.tsx               # Router + layout composition
└── vite-env.d.ts         # Vite import.meta.env types
supabase/
└── schema.sql            # Complete Supabase setup (tables, RLS, storage, seed)
```

---

## Part A: Connect the Project to Supabase

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **New Project**. Choose a name (e.g. `logicore`), set a strong database password, and pick the region closest to Algeria (e.g. **eu-west-1 Paris**).
3. Wait about 2 minutes for the project to initialize.

### 2. Run the SQL Schema

1. In your project dashboard, go to **SQL Editor** in the left sidebar.
2. Click **+ New query**.
3. Open `supabase/schema.sql` from this project, copy the entire contents, and paste them into the editor.
4. Click **Run**. You should see "Success. No rows returned."

This creates:
- `events` table with RLS policies (public read, admin write)
- `join_requests` table with RLS policies (public insert, admin read/write/delete)
- `event-images` storage bucket with public read and admin write policies
- Seed data: 4 archived past events + 1 upcoming event

### 3. Create the Admin User

1. In the dashboard, go to **Authentication → Users**.
2. Click **Add user** (Invite user).
3. Enter the admin's email and a strong password.
4. Click **Create user**.

> ⚠️ **Disable public sign-up:** Go to **Authentication → Providers → Email** and turn OFF **"Enable Email Signup"**. This ensures no one can self-register — only the admin you created manually can log in.

### 4. Verify the Storage Bucket

1. Go to **Storage** in the sidebar.
2. You should see a bucket called `event-images` (created by the SQL). If not, create it manually:
   - Click **New bucket** → name it `event-images` → check **Public bucket** → Save.
3. Click the bucket → go to **Policies** → confirm there are policies for public SELECT and authenticated INSERT/UPDATE/DELETE.

### 5. Copy Environment Variables

1. In the dashboard, go to **Project Settings (gear icon) → API**.
2. Copy **Project URL** and **anon public** key.
3. In the project root, copy `.env.example` to `.env`:
   ```sh
   cp .env.example .env
   ```
4. Edit `.env` and fill in your values:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...your-anon-key...
   ```

> 🔐 **Never use the `service_role` key on the frontend.** The service role key bypasses all Row Level Security and must only be used in trusted server environments (e.g., Supabase Edge Functions or your own server). The `anon` key is safe to expose in the browser because RLS protects your data.

### 6. Test Locally

```sh
npm install
npm run dev
```

Then test:
- **Join form:** Go to `/join`, fill out the form, submit. You should see the success screen.
- **Admin login:** Go to `/admin/login`, sign in with the credentials you created in step 3.
- **Add an event:** In the admin panel → Events → New Event. Fill in the details, upload a cover image, save. The event should appear on the public site.
- **Review requests:** Go to Admin → Join Requests. You should see the test submission.

---

## Part B: Deploy on Vercel

### 1. Push to GitHub

```sh
git init
git add .
git commit -m "feat: initial LogiCore Club website"
# Create a new repo on GitHub (e.g. logicore-club)
git remote add origin https://github.com/YOUR_USERNAME/logicore-club.git
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New → Project**.
3. Find and import your GitHub repository.
4. Vercel should auto-detect **Vite** as the framework preset.
5. Confirm the settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### 3. Set Environment Variables

Before deploying, go to **Environment Variables** in the project settings and add:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://your-project-ref.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...your-anon-key` |

Set them for **Production**, **Preview**, and **Development** environments.

### 4. Deploy

Click **Deploy**. Vercel builds the project and gives you a live URL like `https://logicore-club.vercel.app`.

The `vercel.json` file at the project root already includes the SPA rewrite rule:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
This ensures React Router routes work correctly after page refresh.

### 5. Configure Supabase Auth URLs

1. In Supabase → **Authentication → URL Configuration**:
   - **Site URL:** `https://logicore-club.vercel.app` (your Vercel domain)
   - **Redirect URLs:** Add `https://logicore-club.vercel.app/**`
2. Save.

This is required for Supabase Auth to redirect users correctly after login.

### 6. How Redeploys Work

Every `git push` to the `main` branch triggers an automatic redeploy on Vercel. For preview deploys (pull requests), Vercel creates a unique preview URL.

### 7. Custom Domain

1. In Vercel → your project → **Settings → Domains**.
2. Click **Add Domain**, type your custom domain (e.g. `logicoreclub.dz`).
3. Follow the DNS instructions (add CNAME or A record with your domain registrar).
4. Update the **Site URL** in Supabase Auth to your custom domain.

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| **Blank page on refresh** (404) | SPA routing not configured | Ensure `vercel.json` has the rewrite rule; it's already included |
| **Images not loading** | Bucket is not public | In Supabase → Storage → `event-images` → Policies, add a public SELECT policy |
| **Join form submissions fail** | RLS blocking anon INSERT | Verify the `requests_anon_insert` policy exists on `join_requests` |
| **Admin login fails** | Wrong credentials or sign-up is still enabled | Re-create the admin user in Supabase Auth → Users; disable email sign-ups |
| **"Supabase setup required" page** | Missing or wrong `.env` values | Copy `.env.example` to `.env` and fill in the correct URL and anon key |
| **Events not showing** | RLS blocking public SELECT | Verify the `events_public_select` policy exists on `events` |
| **TypeScript build errors** | Outdated deps or type issues | Run `npm install` and then `npm run build`; fix any reported type errors |

---

## Development

```sh
npm install       # Install dependencies
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Type-check + build to dist/
npm run preview   # Serve the built dist/ locally
```

## Editing Content

- **Club info, tagline, email, Instagram:** `src/constants/index.ts` → `CLUB` object
- **Stats (members, years active):** `src/constants/index.ts` → `STATS` object  
- **About page text:** `src/constants/index.ts` → `ABOUT_CONTENT` object
- **Feature cards on home page:** `src/constants/index.ts` → `FEATURES` array
- **Nav links:** `src/constants/index.ts` → `NAV_LINKS`

---

## License

MIT © LogiCore Club
