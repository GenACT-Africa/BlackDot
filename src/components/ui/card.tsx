import { cn } from '@/lib/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className, glow = false, hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass rounded-2xl p-6',
        glow && 'shadow-glow-purple-sm',
        hover && 'transition-all duration-300 hover:border-purple-500/30 hover:shadow-glow-purple-sm cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = 'purple',
}: {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: { value: number; label: string }
  color?: 'purple' | 'blue' | 'gold' | 'green'
}) {
  const colors = {
    purple: 'text-purple-400 bg-purple-500/15',
    blue: 'text-blue-400 bg-blue-500/15',
    gold: 'text-amber-400 bg-amber-500/15',
    green: 'text-green-400 bg-green-500/15',
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/50 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <p className={cn('text-xs mt-1', trend.value >= 0 ? 'text-green-400' : 'text-red-400')}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors[color])}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
