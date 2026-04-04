-- ============================================================
-- BlackDot Music – Seed Data
-- ============================================================

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('project-files', 'project-files', FALSE),
  ('avatars',       'avatars',       TRUE),
  ('talent-media',  'talent-media',  TRUE),
  ('cover-art',     'cover-art',     TRUE)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Auth upload project files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-files' AND auth.role() = 'authenticated');

CREATE POLICY "Auth read project files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-files' AND auth.role() = 'authenticated');

CREATE POLICY "Public read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('avatars', 'talent-media', 'cover-art'));

CREATE POLICY "Auth upload public media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('avatars', 'talent-media', 'cover-art') AND auth.role() = 'authenticated');

-- Services
INSERT INTO public.services (name, slug, description, long_desc, price_tzs, billing_unit, category, is_remote, icon, display_order)
VALUES
  (
    'Recording Session (Studio)',
    'recording-studio',
    'Professional in-studio recording with top-tier microphones.',
    'Record in our world-class studio equipped with premium analog and digital signal chain. Our acoustically treated rooms deliver pristine recordings every time. Includes engineer, setup, and mixdown preparation.',
    50000, 'hour', 'recording', FALSE, 'Mic', 1
  ),
  (
    'Recording Session (Remote)',
    'recording-remote',
    'High-fidelity remote session with live engineer monitoring.',
    'Record from anywhere in the world with real-time guidance from our engineers. We use studio-grade remote collaboration tools to ensure your remote session sounds as good as being in the room.',
    100000, 'hour', 'recording', TRUE, 'Globe', 2
  ),
  (
    'Beats Production',
    'beats-production',
    'Custom beat crafted to your genre and creative direction.',
    'Work directly with our in-house producers to create a unique beat tailored to your sound. Includes up to 3 revision rounds, stems delivery, and full exclusive ownership upon final payment.',
    500000, 'project', 'production', FALSE, 'Music', 3
  ),
  (
    'Mixing & Mastering',
    'mixing-mastering',
    'Full stereo mix and loudness-optimised master for distribution.',
    'Your track gets a full professional mix with spatial placement, dynamic control, and tonal balance — then mastered to streaming loudness standards (Spotify, Apple Music, YouTube). Includes 2 revisions.',
    500000, 'track', 'post', FALSE, 'Sliders', 4
  );

-- Testimonials
INSERT INTO public.testimonials (client_name, client_role, body, rating, display_order)
VALUES
  ('Baraka J.', 'Recording Artist – Nairobi', 'BlackDot delivered beyond my expectations. The remote session felt like I was physically in the studio. My EP has never sounded this good.', 5, 1),
  ('Amara S.', 'Singer-Songwriter – London', 'I have worked with studios in London and New York. BlackDot''s quality is on that level — but way more personal and responsive.', 5, 2),
  ('TanzRocker', 'Band – Dar es Salaam', 'Booking was super easy, dashboard kept us in the loop every step. Final mix was exactly what we wanted.', 5, 3),
  ('Ndugu Films', 'Commercial Director', 'We needed a tight turnaround on a TV ad score. BlackDot nailed it in 48 hours. Will definitely work with them again.', 5, 4),
  ('Zara M.', 'Afrobeats Artist – Dubai', 'The mix quality is insane. My track got featured on a major playlist two weeks after release. BlackDot is the real deal.', 5, 5);
