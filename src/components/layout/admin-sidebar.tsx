'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Calendar, FolderOpen, Users, Star,
  Settings, LogOut, Shield, Bell, ImageIcon, Inbox, X,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { label: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { label: 'Portfolio', href: '/admin/portfolio', icon: ImageIcon },
  { label: 'Clients', href: '/admin/clients', icon: Users },
  { label: 'Talents', href: '/admin/talents', icon: Star },
  { label: 'Messages', href: '/admin/messages', icon: Inbox },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

interface AdminSidebarProps {
  pendingPayments?: number
  unreadMessages?: number
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function AdminSidebar({ pendingPayments = 0, unreadMessages = 0, mobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const sidebarContent = (
    <aside className="w-full flex flex-col h-full border-r border-white/8 bg-brand-black-2">
      {/* Brand + Bell */}
      <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group" onClick={onMobileClose}>
          <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
            <span className="text-white font-black text-xs">B</span>
          </div>
          <div>
            <span className="font-bold text-sm text-white block leading-none">BlackDot</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Shield size={9} className="text-amber-400" />
              <span className="text-[9px] text-amber-400 font-semibold uppercase tracking-wider">Admin</span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {/* Notification Bell */}
          <Link
            href="/admin/bookings"
            onClick={onMobileClose}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/8 transition-colors"
            title={pendingPayments > 0 ? `${pendingPayments} payment${pendingPayments > 1 ? 's' : ''} awaiting verification` : 'Notifications'}
          >
            <Bell
              size={16}
              className={pendingPayments > 0 ? 'text-amber-400' : 'text-white/30'}
            />
            {pendingPayments > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-amber-500 rounded-full flex items-center justify-center px-1">
                <span className="text-[9px] font-black text-black leading-none">{pendingPayments > 9 ? '9+' : pendingPayments}</span>
              </span>
            )}
          </Link>

          {/* Close button — mobile only */}
          <button
            onClick={onMobileClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/8 text-white/30 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              onClick={onMobileClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={16} className={isActive ? 'text-purple-400' : ''} />
              {label}
              {label === 'Bookings' && pendingPayments > 0 && (
                <span className="ml-auto text-[10px] font-bold text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded-full">
                  {pendingPayments}
                </span>
              )}
              {label === 'Messages' && unreadMessages > 0 && (
                <span className="ml-auto text-[10px] font-bold text-purple-300 bg-purple-500/15 px-1.5 py-0.5 rounded-full">
                  {unreadMessages}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/8">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-60 flex-shrink-0 h-full">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  )
}
