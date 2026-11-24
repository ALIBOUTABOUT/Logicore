-- ============================================================
-- LogiCore Club — Supabase Schema
-- Paste this entire file into the Supabase SQL Editor and run.
-- ============================================================

-- ─── IMPORTANT: Disable public sign-ups ─────────────────────────────────────
-- After running this script, go to:
--   Supabase Dashboard → Authentication → Providers → Email
-- and turn OFF "Enable Email Signup" so only the admin you create
-- manually (Authentication → Users → Add user) can sign in.
-- Because public sign-up is disabled, "authenticated" effectively
-- means the single admin account.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Helper: auto-update updated_at column ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ─── Table: events ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.events (
  id                uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text         NOT NULL CHECK (char_length(title) BETWEEN 2 AND 200),
  short_description text         CHECK (char_length(short_description) <= 300),
  description       text         CHECK (char_length(description) <= 5000),
  event_date        date         NOT NULL,
  start_time        time,
  end_time          time,
  location          text         CHECK (char_length(location) <= 200),
  cover_image_url   text,
  gallery_urls      text[]       NOT NULL DEFAULT '{}',
  status            text         NOT NULL DEFAULT 'upcoming'
                                 CHECK (status IN ('upcoming', 'archived')),
  created_at        timestamptz  NOT NULL DEFAULT now(),
  updated_at        timestamptz  NOT NULL DEFAULT now()
);

-- updated_at trigger for events
DROP TRIGGER IF EXISTS events_updated_at ON public.events;
CREATE TRIGGER events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── Table: join_requests ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.join_requests (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     text         NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  email         text         NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone         text         CHECK (phone IS NULL OR (char_length(phone) BETWEEN 7 AND 20 AND phone ~ '^[0-9+\s\-().]+$')),
  major         text         NOT NULL CHECK (char_length(major) BETWEEN 2 AND 100),
  academic_year text         NOT NULL CHECK (academic_year IN ('L1','L2','L3','M1','M2','PhD','Other')),
  interests     text[]       NOT NULL DEFAULT '{}',
  message       text         NOT NULL CHECK (char_length(message) BETWEEN 20 AND 600),
  status        text         NOT NULL DEFAULT 'new'
                             CHECK (status IN ('new', 'accepted', 'rejected')),
  created_at    timestamptz  NOT NULL DEFAULT now()
);

-- ─── Row Level Security ──────────────────────────────────────────────────────
ALTER TABLE public.events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

-- events policies
-- Both anon visitors and authenticated admin can read events
DROP POLICY IF EXISTS "events_public_select" ON public.events;
CREATE POLICY "events_public_select"
  ON public.events FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users (admin) can insert / update / delete
DROP POLICY IF EXISTS "events_admin_insert" ON public.events;
CREATE POLICY "events_admin_insert"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "events_admin_update" ON public.events;
CREATE POLICY "events_admin_update"
  ON public.events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "events_admin_delete" ON public.events;
CREATE POLICY "events_admin_delete"
  ON public.events FOR DELETE
  TO authenticated
  USING (true);

-- join_requests policies
-- Anon can INSERT only (no SELECT, UPDATE or DELETE for anon)
-- Authenticated is also permitted to INSERT in case the admin tests /join while logged in
DROP POLICY IF EXISTS "requests_anon_insert" ON public.join_requests;
CREATE POLICY "requests_anon_insert"
  ON public.join_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated admin can read, update or delete join requests
DROP POLICY IF EXISTS "requests_admin_select" ON public.join_requests;
CREATE POLICY "requests_admin_select"
  ON public.join_requests FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "requests_admin_update" ON public.join_requests;
CREATE POLICY "requests_admin_update"
  ON public.join_requests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "requests_admin_delete" ON public.join_requests;
CREATE POLICY "requests_admin_delete"
  ON public.join_requests FOR DELETE
  TO authenticated
  USING (true);

-- ─── OPTIONAL: Stricter admin email check ───────────────────────────────────
-- If you want to restrict admin writes/reads to one specific email address
-- even if another user were ever created, replace the authenticated policies
-- above with checks like:
--
--   CREATE POLICY "events_admin_insert"
--     ON public.events FOR INSERT
--     TO authenticated
--     WITH CHECK (auth.jwt() ->> 'email' = 'logicoreclub.22@gmail.com');
--
--   CREATE POLICY "requests_admin_select"
--     ON public.join_requests FOR SELECT
--     TO authenticated
--     USING (auth.jwt() ->> 'email' = 'logicoreclub.22@gmail.com');
--
-- Do the same for UPDATE and DELETE on both tables and storage.objects.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Storage: event-images bucket ───────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
DROP POLICY IF EXISTS "event_images_public_read" ON storage.objects;
CREATE POLICY "event_images_public_read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'event-images');

-- Authenticated can upload, update, delete
DROP POLICY IF EXISTS "event_images_admin_insert" ON storage.objects;
CREATE POLICY "event_images_admin_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-images');

DROP POLICY IF EXISTS "event_images_admin_update" ON storage.objects;
CREATE POLICY "event_images_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'event-images')
  WITH CHECK (bucket_id = 'event-images');

DROP POLICY IF EXISTS "event_images_admin_delete" ON storage.objects;
CREATE POLICY "event_images_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'event-images');

-- ─── Seed data ───────────────────────────────────────────────────────────────
-- Realistic past and upcoming events so the site does not look empty.
-- No cover images are set; the UI displays a crisp placeholder when cover_image_url IS NULL.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.events LIMIT 1) THEN
    INSERT INTO public.events
      (title, short_description, description, event_date, start_time, end_time, location, status, gallery_urls)
    VALUES
      (
        'Open Day — LogiCore Club',
        'Discover LogiCore: meet the team, explore our projects, and find out how to join.',
        'On December 2, 2025, LogiCore Club opened its doors to all students of the Faculty of Exact Sciences. Visitors met our members, learned about the club''s mission, explored live coding demos and math challenges, and asked questions about how to apply.',
        '2025-12-02',
        '10:00', '14:00',
        'Faculty of Exact Sciences, UDL, Sidi Bel Abbès',
        'archived',
        '{}'
      ),
      (
        'Information Day & Selection Interviews',
        'Official information session and selection interviews for new LogiCore members.',
        'Following our Open Day, LogiCore held its information and selection day on December 17, 2025. Prospective members attended a presentation on the club''s structure and activities, followed by short individual interviews with the selection committee.',
        '2025-12-17',
        '09:00', '17:00',
        'Faculty of Exact Sciences, UDL, Sidi Bel Abbès',
        'archived',
        '{}'
      ),
      (
        'Green Economy & Entrepreneurship — with Finova Club',
        'A joint lecture on green economy, sustainable entrepreneurship, and innovation.',
        'LogiCore Club partnered with Finova Club to co-host an insightful lecture on the intersection of green economy and entrepreneurship. Speakers explored how software engineering, data science, and mathematical modeling can drive sustainable business models in Algeria.',
        '2026-02-20',
        '14:00', '17:00',
        'Amphitheater, Faculty of Exact Sciences, UDL',
        'archived',
        '{}'
      ),
      (
        'Pi Day — Mathematics & Code',
        'Celebrating the world''s favorite mathematical constant with puzzles, code challenges, and talks.',
        'On March 11, LogiCore Club celebrated Pi Day with mathematical exploration: π trivia, speed-solving challenges, numerical approximation algorithms in Python, and a friendly competition among FSE students.',
        '2026-03-11',
        '10:00', '15:00',
        'Faculty of Exact Sciences, UDL, Sidi Bel Abbès',
        'archived',
        '{}'
      ),
      (
        'Algorithmic Problem Solving & Applied Math Workshop',
        'Hands-on workshop exploring graph theory, dynamic programming, and mathematical problem solving.',
        'Join LogiCore Club for an interactive workshop bridging mathematical reasoning and clean algorithmic code. Open to L1–PhD students at FSE, covering graph traversal, recurrences, and live team coding challenges.',
        (CURRENT_DATE + INTERVAL '14 days')::date,
        '13:30', '16:30',
        'Faculty of Exact Sciences, UDL, Sidi Bel Abbès',
        'upcoming',
        '{}'
      );
  END IF;
END $$;
