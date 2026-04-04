'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FolderOpen, Calendar, CreditCard,
  Settings, LogOut, Music2
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { label: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
  { label: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface DashboardSidebarProps {
  userName?: string
  userRole?: string
}

export function DashboardSidebar({ userName, userRole }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col h-full border-r border-white/8 bg-brand-black-2">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-white/8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center shadow-glow-purple-sm">
            <span className="text-white font-black text-xs">B</span>
          </div>
          <span className="font-bold text-sm text-white">BlackDot</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={16} className={isActive ? 'text-purple-400' : ''} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-white/8 space-y-1">
        <Link href="/book" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-400 hover:bg-purple-500/10 transition-all">
          <Music2 size={16} />
          New Booking
        </Link>
        <div className="px-3 py-2.5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white truncate max-w-[100px]">
              {userName || 'Artist'}
            </p>
            <p className="text-[10px] text-white/40 capitalize">{userRole || 'Client'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/30 hover:text-red-400 transition-all"
            title="Log out"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  )
}
