import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your free BlackDot Music account to book sessions, track project progress, and manage payments. Join artists from 15+ countries making music worldwide.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
