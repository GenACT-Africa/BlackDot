import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio – Admin',
  description: 'Manage the BlackDot Music public portfolio — add, edit, or remove tracks and projects, set cover art, link streaming platforms, and control visibility.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
