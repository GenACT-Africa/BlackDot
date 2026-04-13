-- Reorder talents: Gachi B (1), Sign Beats (2), Mighty Jones (3), Saiko Midundo (4)
UPDATE public.talents SET display_order = 1 WHERE name = 'Gachi B';
UPDATE public.talents SET display_order = 2 WHERE name = 'Sign Beats';
UPDATE public.talents SET display_order = 3 WHERE name = 'Mighty Jones';
UPDATE public.talents SET display_order = 4 WHERE name = 'Saiko Midundo';
