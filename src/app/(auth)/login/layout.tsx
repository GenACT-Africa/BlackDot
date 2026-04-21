import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your BlackDot Music artist dashboard to track bookings, manage projects, and view payment history — your studio experience, all in one place.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
