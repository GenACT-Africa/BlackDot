import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Update your BlackDot Music artist profile, manage contact details, and change your password securely. Keep your account information accurate and up to date.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
