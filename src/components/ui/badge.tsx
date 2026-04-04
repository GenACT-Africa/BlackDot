import { cn } from '@/lib/utils/cn'
import type { BookingStatus, ProjectStatus, PaymentStatus } from '@/types'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'purple' | 'blue' | 'gold' | 'green' | 'red' | 'gray'
  size?: 'sm' | 'md'
  className?: string
  dot?: boolean
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
  dot = false,
}: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-white/70 border border-white/10',
    purple: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    gold: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    green: 'bg-green-500/20 text-green-300 border border-green-500/30',
    red: 'bg-red-500/20 text-red-300 border border-red-500/30',
    gray: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full', {
            'bg-white/50': variant === 'default',
            'bg-purple-400': variant === 'purple',
            'bg-blue-400': variant === 'blue',
            'bg-amber-400': variant === 'gold',
            'bg-green-400': variant === 'green',
            'bg-red-400': variant === 'red',
            'bg-gray-400': variant === 'gray',
          })}
        />
      )}
      {children}
    </span>
  )
}

// Specialized status badges
const bookingStatusConfig: Record<BookingStatus, { label: string; variant: BadgeProps['variant'] }> = {
  pending: { label: 'Pending', variant: 'gold' },
  confirmed: { label: 'Confirmed', variant: 'blue' },
  in_progress: { label: 'In Progress', variant: 'purple' },
  completed: { label: 'Completed', variant: 'green' },
  cancelled: { label: 'Cancelled', variant: 'red' },
}

const projectStatusConfig: Record<ProjectStatus, { label: string; variant: BadgeProps['variant'] }> = {
  briefing: { label: 'Briefing', variant: 'gray' },
  pre_production: { label: 'Pre-Production', variant: 'blue' },
  recording: { label: 'Recording', variant: 'purple' },
  mixing: { label: 'Mixing', variant: 'purple' },
  mastering: { label: 'Mastering', variant: 'blue' },
  review: { label: 'Review', variant: 'gold' },
  delivered: { label: 'Delivered', variant: 'green' },
  archived: { label: 'Archived', variant: 'gray' },
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const config = bookingStatusConfig[status]
  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  )
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const config = projectStatusConfig[status]
  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  )
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config: Record<PaymentStatus, { label: string; variant: BadgeProps['variant'] }> = {
    pending: { label: 'Pending', variant: 'gold' },
    processing: { label: 'Processing', variant: 'blue' },
    paid: { label: 'Paid', variant: 'green' },
    failed: { label: 'Failed', variant: 'red' },
    refunded: { label: 'Refunded', variant: 'gray' },
  }
  const c = config[status]
  return <Badge variant={c.variant} dot>{c.label}</Badge>
}
