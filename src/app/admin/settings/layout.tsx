import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings – Admin',
  description: 'Update your BlackDot Music admin profile and account security. Change your display name, contact details, and password directly from the admin settings panel.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
