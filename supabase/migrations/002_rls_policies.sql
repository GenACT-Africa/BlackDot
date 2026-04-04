-- ============================================================
-- BlackDot Music – Row Level Security Policies
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Helper function: is current user admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── PROFILES ────────────────────────────────────────────────
CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Admins full access profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- ── BOOKINGS ─────────────────────────────────────────────────
CREATE POLICY "Clients see own bookings"
  ON public.bookings FOR SELECT
  USING (client_id = auth.uid() OR public.is_admin());

CREATE POLICY "Clients create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Admins manage bookings"
  ON public.bookings FOR ALL
  USING (public.is_admin());

-- ── PROJECTS ────────────────────────────────────────────────
CREATE POLICY "Clients see own projects"
  ON public.projects FOR SELECT
  USING (client_id = auth.uid() OR public.is_admin() OR is_public = TRUE);

CREATE POLICY "Admins manage projects"
  ON public.projects FOR ALL
  USING (public.is_admin());

-- ── MILESTONES ──────────────────────────────────────────────
CREATE POLICY "Project participants see milestones"
  ON public.project_milestones FOR SELECT
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.client_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage milestones"
  ON public.project_milestones FOR ALL
  USING (public.is_admin());

-- ── MESSAGES ────────────────────────────────────────────────
CREATE POLICY "Project participants read messages"
  ON public.messages FOR SELECT
  USING (
    public.is_admin() OR
    sender_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.client_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users send messages"
  ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- ── PROJECT FILES ────────────────────────────────────────────
CREATE POLICY "Project participants read files"
  ON public.project_files FOR SELECT
  USING (
    public.is_admin() OR
    uploader_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.client_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated upload files"
  ON public.project_files FOR INSERT
  WITH CHECK (uploader_id = auth.uid());

CREATE POLICY "Owner or admin delete files"
  ON public.project_files FOR DELETE
  USING (public.is_admin() OR uploader_id = auth.uid());

-- ── PAYMENTS ────────────────────────────────────────────────
CREATE POLICY "Clients see own payments"
  ON public.payments FOR SELECT
  USING (client_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins manage payments"
  ON public.payments FOR ALL
  USING (public.is_admin());

-- ── TALENTS (public read) ────────────────────────────────────
CREATE POLICY "Anyone reads active talents"
  ON public.talents FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins manage talents"
  ON public.talents FOR ALL
  USING (public.is_admin());

-- ── SERVICES (public read) ───────────────────────────────────
CREATE POLICY "Anyone reads active services"
  ON public.services FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins manage services"
  ON public.services FOR ALL
  USING (public.is_admin());

-- ── TESTIMONIALS (public read) ───────────────────────────────
CREATE POLICY "Anyone reads active testimonials"
  ON public.testimonials FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins manage testimonials"
  ON public.testimonials FOR ALL
  USING (public.is_admin());

-- ── CONTACT INQUIRIES ─────────────────────────────────────────
CREATE POLICY "Anyone submits inquiries"
  ON public.contact_inquiries FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admins read inquiries"
  ON public.contact_inquiries FOR SELECT
  USING (public.is_admin());
