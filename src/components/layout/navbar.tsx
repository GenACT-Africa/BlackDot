'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ButtonLink } from '@/components/ui/button-link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/projects' },
  { label: 'Talents', href: '/talents' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dashboardHref, setDashboardHref] = useState('/dashboard')

  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Auth state + admin check
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      const user = data.user

      if (!user) {
        setIsLoggedIn(false)
        setDashboardHref('/dashboard')
        return
      }

      setIsLoggedIn(true)

      // Check user_metadata first (fast, no DB call)
      if (user.user_metadata?.role === 'admin') {
        setDashboardHref('/admin')
        return
      }

      // Fallback: check profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      setDashboardHref(profile?.role === 'admin' ? '/admin' : '/dashboard')
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          setIsLoggedIn(false)
          setDashboardHref('/dashboard')
        } else {
          setIsLoggedIn(true)
          getUser()
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-brand-black/90 backdrop-blur-xl border-b border-white/8 py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="w-16 h-16 rounded-lg bg-purple-600/20 inline-flex items-center justify-center shadow-glow-purple-sm transition-all group-hover:shadow-glow-purple">
              <span className="w-16 h-16 relative inline-block">
                <Image
                  src="/blackdot-logo.png"
                  alt="BlackDot Music Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </span>
            </span>
            <span className="font-bold text-base tracking-tight leading-tight">
              <span className="text-white block">Digital</span>
              <span className="text-purple-400 block"> Studio</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  pathname === link.href
                    ? 'text-white bg-white/8'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-white/80 hover:text-white px-4 py-2"
              >
                Log out
              </button>
            ) : (
              <ButtonLink href="/login" variant="ghost" size="sm">
                Log in
              </ButtonLink>
            )}

            {isLoggedIn ? (
              <ButtonLink href={dashboardHref} size="sm" glow>
                Dashboard
              </ButtonLink>
            ) : (
              <ButtonLink href="/book" size="sm" glow>
                Book a Session
              </ButtonLink>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden pt-16">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative bg-brand-black-2 border-b border-white/10 px-4 pt-4 pb-6">

            <div className="flex flex-col gap-1 mb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-3 text-base font-medium rounded-xl transition-all',
                    pathname === link.href
                      ? 'text-white bg-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white font-medium"
                >
                  Log out
                </button>
              ) : (
                <ButtonLink href="/login" variant="secondary" className="w-full">
                  Log in
                </ButtonLink>
              )}

              {isLoggedIn ? (
                <ButtonLink href={dashboardHref} className="w-full" glow>
                  Dashboard
                </ButtonLink>
              ) : (
                <ButtonLink href="/book" className="w-full" glow>
                  Book a Session
                </ButtonLink>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  )
}