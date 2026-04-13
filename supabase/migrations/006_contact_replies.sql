-- Stores admin replies to contact inquiries for thread display
create table if not exists contact_replies (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references contact_inquiries(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_replies_inquiry
  on contact_replies (inquiry_id, created_at);
