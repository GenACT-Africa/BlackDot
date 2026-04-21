import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: "Reset your BlackDot Music account password instantly. Enter your registered email and we'll send a secure link so you can get back to your dashboard right away.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
