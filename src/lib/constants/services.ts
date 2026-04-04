import type { Service } from '@/types'

export const SERVICES: Service[] = [
  {
    id: 'recording-studio',
    name: 'Studio Session',
    slug: 'recording-studio',
    description: 'Professional in-studio recording with top-tier microphones.',
    long_desc:
      'Record in our world-class studio equipped with premium analog and digital signal chain. Our acoustically treated rooms deliver pristine recordings every time. Includes engineer, setup, and mixdown preparation.',
    price_tzs: 50000,
    billing_unit: 'hour',
    category: 'recording',
    is_remote: false,
    icon: 'Mic',
    is_active: true,
    display_order: 1,
    created_at: '',
  },
  {
    id: 'recording-remote',
    name: 'Remote Session',
    slug: 'recording-remote',
    description: 'High-fidelity remote session with live engineer monitoring.',
    long_desc:
      'Record from anywhere in the world with real-time guidance from our engineers. We use studio-grade remote collaboration tools to ensure your remote session sounds as good as being in the room.',
    price_tzs: 100000,
    billing_unit: 'hour',
    category: 'recording',
    is_remote: true,
    icon: 'Globe',
    is_active: true,
    display_order: 2,
    created_at: '',
  },
  {
    id: 'beats-production',
    name: 'Beats Production',
    slug: 'beats-production',
    description: 'Custom beat crafted to your genre and creative direction.',
    long_desc:
      'Work directly with our in-house producers to create a unique beat tailored to your sound. Includes up to 3 revision rounds, stems delivery, and full exclusive ownership upon final payment.',
    price_tzs: 500000,
    billing_unit: 'project',
    category: 'production',
    is_remote: false,
    icon: 'Music',
    is_active: true,
    display_order: 3,
    created_at: '',
  },
  {
    id: 'mixing-mastering',
    name: 'Mixing & Mastering',
    slug: 'mixing-mastering',
    description: 'Full stereo mix and loudness-optimised master for distribution.',
    long_desc:
      'Your track gets a full professional mix with spatial placement, dynamic control, and tonal balance — then mastered to streaming loudness standards (Spotify, Apple Music, YouTube). Includes 2 revisions.',
    price_tzs: 500000,
    billing_unit: 'track',
    category: 'post',
    is_remote: false,
    icon: 'Sliders',
    is_active: true,
    display_order: 4,
    created_at: '',
  },
]

export const PROJECT_STATUSES = [
  { value: 'briefing', label: 'Briefing', color: 'text-gray-400', bg: 'bg-gray-500/20' },
  { value: 'pre_production', label: 'Pre-Production', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { value: 'recording', label: 'Recording', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  { value: 'mixing', label: 'Mixing', color: 'text-violet-400', bg: 'bg-violet-500/20' },
  { value: 'mastering', label: 'Mastering', color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
  { value: 'review', label: 'Review', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { value: 'delivered', label: 'Delivered', color: 'text-green-400', bg: 'bg-green-500/20' },
  { value: 'archived', label: 'Archived', color: 'text-gray-500', bg: 'bg-gray-600/20' },
] as const

export const BOOKING_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { value: 'confirmed', label: 'Confirmed', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { value: 'in_progress', label: 'In Progress', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  { value: 'completed', label: 'Completed', color: 'text-green-400', bg: 'bg-green-500/20' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/20' },
] as const
