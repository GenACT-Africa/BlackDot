-- Add read/archived status columns to contact_inquiries
alter table contact_inquiries
  add column if not exists read boolean not null default false,
  add column if not exists archived boolean not null default false;

-- Index for fast unread count queries in the admin sidebar
create index if not exists idx_contact_inquiries_unread
  on contact_inquiries (read, archived)
  where read = false and archived = false;
