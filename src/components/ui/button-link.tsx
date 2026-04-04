'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils/cn'

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'gold' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  glow?: boolean
}

/**
 * ButtonLink renders a Next.js <Link> (i.e. an <a> tag) styled identically
 * to the Button component. Use this instead of wrapping <Button> in <Link>,
 * which produces an invalid <button> inside <a> and causes React hydration errors.
 */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  glow = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-black select-none'

  const variants = {
    primary:
      'bg-purple-600 hover:bg-purple-500 text-white focus:ring-purple-500 active:scale-[0.98]',
    secondary:
      'bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20 focus:ring-white/30 active:scale-[0.98]',
    ghost: 'hover:bg-white/8 text-white/70 hover:text-white focus:ring-white/20',
    outline:
      'border border-purple-500/50 hover:border-purple-400 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 focus:ring-purple-500 active:scale-[0.98]',
    gold: 'bg-amber-500 hover:bg-amber-400 text-black font-bold focus:ring-amber-400 active:scale-[0.98]',
    danger:
      'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-400/50 focus:ring-red-500',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
    xl: 'px-10 py-4 text-lg',
  }

  const glowClass = glow && variant === 'primary' ? 'shadow-glow-purple' : ''

  return (
    <Link
      className={cn(base, variants[variant], sizes[size], glowClass, className)}
      {...props}
    >
      {children}
    </Link>
  )
}
