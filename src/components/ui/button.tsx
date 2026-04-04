'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'gold' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  glow?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      glow = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-black select-none'

    const variants = {
      primary:
        'bg-purple-600 hover:bg-purple-500 text-white focus:ring-purple-500 active:scale-[0.98]',
      secondary:
        'bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20 focus:ring-white/30 active:scale-[0.98]',
      ghost:
        'hover:bg-white/8 text-white/70 hover:text-white focus:ring-white/20',
      outline:
        'border border-purple-500/50 hover:border-purple-400 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 focus:ring-purple-500 active:scale-[0.98]',
      gold:
        'bg-amber-500 hover:bg-amber-400 text-black font-bold focus:ring-amber-400 active:scale-[0.98]',
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
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], glowClass, className)}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
