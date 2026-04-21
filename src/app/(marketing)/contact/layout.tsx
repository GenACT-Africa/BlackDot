import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact BlackDot Music recording studio in Dar es Salaam. Reach us by email, WhatsApp, or fill in the form — we reply within 24 hours, remote or in-person.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
