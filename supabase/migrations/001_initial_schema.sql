-- ============================================================
-- BlackDot Music – Initial Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- PROFILES (extends auth.users 1:1)
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  phone       TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin', 'talent')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- TALENTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.talents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  roles           TEXT[] NOT NULL DEFAULT '{}',
  bio             TEXT,
  avatar_url      TEXT,
  cover_url       TEXT,
  instagram_url   TEXT,
  soundcloud_url  TEXT,
  spotify_url     TEXT,
  youtube_url     TEXT,
  genres          TEXT[] DEFAULT '{}',
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  display_order   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- SERVICES (catalog — admin seeded)
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.services (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  long_desc     TEXT,
  price_tzs     INTEGER NOT NULL,
  billing_unit  TEXT NOT NULL CHECK (billing_unit IN ('hour', 'track', 'project')),
  category      TEXT NOT NULL CHECK (category IN ('recording', 'production', 'post')),
  is_remote     BOOLEAN NOT NULL DEFAULT FALSE,
  icon          TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- BOOKINGS
-- ────────────────────────────────────────────────────────────
CREATE TYPE booking_status AS ENUM (
  'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
);

CREATE TABLE public.bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_ref     TEXT NOT NULL UNIQUE DEFAULT ('BK-' || upper(substring(gen_random_uuid()::text, 1, 8))),
  client_id       UUID NOT NULL REFERENCES public.profiles(id),
  service_id      UUID NOT NULL REFERENCES public.services(id),
  talent_id       UUID REFERENCES public.talents(id),
  status          booking_status NOT NULL DEFAULT 'pending',
  session_date    DATE,
  start_time      TIME,
  duration_hours  NUMERIC(4,2),
  project_title   TEXT NOT NULL,
  project_notes   TEXT,
  reference_links TEXT[],
  quoted_price    INTEGER NOT NULL,
  discount_tzs    INTEGER DEFAULT 0,
  total_price     INTEGER NOT NULL,
  admin_notes     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at    TIMESTAMPTZ,
  cancelled_at    TIMESTAMPTZ,
  cancel_reason   TEXT
);

-- ────────────────────────────────────────────────────────────
-- PROJECTS
-- ────────────────────────────────────────────────────────────
CREATE TYPE project_status AS ENUM (
  'briefing', 'pre_production', 'recording',
  'mixing', 'mastering', 'review', 'delivered', 'archived'
);

CREATE TABLE public.projects (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id    UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  client_id     UUID NOT NULL REFERENCES public.profiles(id),
  talent_id     UUID REFERENCES public.talents(id),
  title         TEXT NOT NULL,
  description   TEXT,
  status        project_status NOT NULL DEFAULT 'briefing',
  progress_pct  INTEGER NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  deadline      DATE,
  delivered_at  TIMESTAMPTZ,
  is_public     BOOLEAN NOT NULL DEFAULT FALSE,
  public_slug   TEXT UNIQUE,
  cover_art_url TEXT,
  genre         TEXT,
  bpm           INTEGER,
  key_signature TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- PROJECT MILESTONES
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.project_milestones (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  is_done     BOOLEAN NOT NULL DEFAULT FALSE,
  due_date    DATE,
  done_at     TIMESTAMPTZ,
  order_idx   INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- MESSAGES (per-project realtime chat)
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES public.profiles(id),
  body        TEXT,
  file_url    TEXT,
  file_name   TEXT,
  file_size   INTEGER,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_project_id ON public.messages(project_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- ────────────────────────────────────────────────────────────
-- PROJECT FILES
-- ────────────────────────────────────────────────────────────
CREATE TYPE file_category AS ENUM (
  'reference', 'stems', 'mix', 'master', 'invoice', 'other'
);

CREATE TABLE public.project_files (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id    UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  uploader_id   UUID NOT NULL REFERENCES public.profiles(id),
  storage_path  TEXT NOT NULL,
  file_name     TEXT NOT NULL,
  file_size     INTEGER NOT NULL,
  mime_type     TEXT NOT NULL,
  category      file_category NOT NULL DEFAULT 'other',
  version       INTEGER NOT NULL DEFAULT 1,
  is_latest     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_project_files_project_id ON public.project_files(project_id);

-- ────────────────────────────────────────────────────────────
-- PAYMENTS
-- ────────────────────────────────────────────────────────────
CREATE TYPE payment_status AS ENUM (
  'pending', 'processing', 'paid', 'failed', 'refunded'
);

CREATE TABLE public.payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id      UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  project_id      UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  client_id       UUID NOT NULL REFERENCES public.profiles(id),
  amount_tzs      INTEGER NOT NULL,
  status          payment_status NOT NULL DEFAULT 'pending',
  payment_method  TEXT,
  gateway_ref     TEXT,
  paid_at         TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- CONTACT INQUIRIES
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.contact_inquiries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- TESTIMONIALS
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.testimonials (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_role TEXT,
  avatar_url  TEXT,
  body        TEXT NOT NULL,
  rating      INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- UPDATED_AT TRIGGER
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ────────────────────────────────────────────────────────────
-- AUTO-CREATE PROFILE ON SIGNUP
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
