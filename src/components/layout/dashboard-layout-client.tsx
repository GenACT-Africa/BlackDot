'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { DashboardSidebar } from './dashboard-sidebar'

interface Props {
  children: React.ReactNode
  userName?: string
  userRole?: string
}

export function DashboardLayoutClient({ children, userName, userRole }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-brand-black">
      <DashboardSidebar
        userName={userName}
        userRole={userRole}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 h-14 px-4 border-b border-white/8 bg-brand-black-2 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/8 text-white/60 hover:text-white transition-colors"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center">
              <span className="text-white font-black text-[10px]">B</span>
            </div>
            <span className="font-bold text-sm text-white">BlackDot</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
