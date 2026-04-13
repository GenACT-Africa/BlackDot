export type UserRole = 'client' | 'admin' | 'talent'

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

export type ProjectStatus =
  | 'briefing'
  | 'pre_production'
  | 'recording'
  | 'mixing'
  | 'mastering'
  | 'review'
  | 'delivered'
  | 'archived'

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'

export type FileCategory = 'reference' | 'stems' | 'mix' | 'master' | 'invoice' | 'other'

export type BillingUnit = 'hour' | 'track' | 'project'

export type ServiceCategory = 'recording' | 'production' | 'post'

export interface Profile {
  id: string
  full_name: string
  phone?: string | null
  avatar_url?: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  slug: string
  description?: string | null
  long_desc?: string | null
  price_tzs: number
  billing_unit: BillingUnit
  category: ServiceCategory
  is_remote: boolean
  icon?: string | null
  is_active: boolean
  display_order: number
  created_at: string
}

export interface Talent {
  id: string
  profile_id?: string | null
  name: string
  slug: string
  roles: string[]
  bio?: string | null
  avatar_url?: string | null
  cover_url?: string | null
  instagram_url?: string | null
  soundcloud_url?: string | null
  spotify_url?: string | null
  youtube_url?: string | null
  genres: string[]
  is_featured: boolean
  is_active: boolean
  display_order: number
  created_at: string
}

export interface Booking {
  id: string
  booking_ref: string
  client_id: string
  service_id: string
  talent_id?: string | null
  status: BookingStatus
  session_date?: string | null
  start_time?: string | null
  duration_hours?: number | null
  project_title: string
  project_notes?: string | null
  reference_links?: string[] | null
  quoted_price: number
  discount_tzs: number
  total_price: number
  admin_notes?: string | null
  created_at: string
  updated_at: string
  confirmed_at?: string | null
  cancelled_at?: string | null
  cancel_reason?: string | null
  // joins
  service?: Service
  talent?: Talent | null
  client?: Profile
}

export interface Project {
  id: string
  booking_id?: string | null
  client_id: string
  talent_id?: string | null
  title: string
  description?: string | null
  status: ProjectStatus
  progress_pct: number
  deadline?: string | null
  delivered_at?: string | null
  is_public: boolean
  public_slug?: string | null
  cover_art_url?: string | null
  genre?: string | null
  bpm?: number | null
  key_signature?: string | null
  created_at: string
  updated_at: string
  // joins
  client?: Profile
  talent?: Talent | null
  milestones?: ProjectMilestone[]
  files?: ProjectFile[]
  payments?: Payment[]
  unread_messages?: number
}

export interface ProjectMilestone {
  id: string
  project_id: string
  title: string
  description?: string | null
  is_done: boolean
  due_date?: string | null
  done_at?: string | null
  order_idx: number
  created_at: string
}

export interface Message {
  id: string
  project_id: string
  sender_id: string
  body?: string | null
  file_url?: string | null
  file_name?: string | null
  file_size?: number | null
  is_read: boolean
  created_at: string
  sender?: Profile
}

export interface ProjectFile {
  id: string
  project_id: string
  uploader_id: string
  storage_path: string
  file_name: string
  file_size: number
  mime_type: string
  category: FileCategory
  version: number
  is_latest: boolean
  created_at: string
  uploader?: Profile
}

export interface Payment {
  id: string
  booking_id?: string | null
  project_id?: string | null
  client_id: string
  amount_tzs: number
  status: PaymentStatus
  payment_method?: string | null
  gateway_ref?: string | null
  paid_at?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  client_name: string
  client_role?: string | null
  avatar_url?: string | null
  body: string
  rating: number
  is_active: boolean
  display_order: number
  created_at: string
}

export interface ContactInquiry {
  id: string
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

// ── Booking Flow State ────────────────────────────────────────
export interface SelectedService {
  service: Service
  quantity: number // tracks/projects for non-hourly billing; ignored for hourly (uses durationHours)
}

export interface BookingFormState {
  step: 1 | 2 | 3 | 4
  services: SelectedService[]
  talentId: string | null
  projectTitle: string
  projectNotes: string
  referenceLinks: string[]
  sessionDate: string | null
  startTime: string | null
  durationHours: number
}
