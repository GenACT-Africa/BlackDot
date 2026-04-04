import Link from 'next/link'
import { Instagram, Youtube, Twitter } from 'lucide-react'

const links = {
  Studio: [
    { label: 'Services', href: '/services' },
    { label: 'Talents', href: '/talents' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
  ],
  Support: [
    { label: 'Book a Session', href: '/book' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-brand-black-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center shadow-glow-purple-sm">
                <span className="text-white font-black text-sm">B</span>
              </div>
              <span className="font-bold text-base tracking-tight">
                <span className="text-white">BlackDot</span>
                <span className="text-purple-400"> Music</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Create world-class music from anywhere. Premier recording studio in Dar es Salaam
              with global reach.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl glass hover:border-purple-500/40 hover:text-purple-400 text-white/40 transition-all"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl glass hover:border-purple-500/40 hover:text-purple-400 text-white/40 transition-all"
              >
                <Youtube size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl glass hover:border-purple-500/40 hover:text-purple-400 text-white/40 transition-all"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
                {group}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} BlackDot Music. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Dar es Salaam, Tanzania · Available Worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
