export function formatTZS(amount: number): string {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatTZSCompact(amount: number): string {
  if (amount >= 1_000_000) {
    return `TZS ${(amount / 1_000_000).toFixed(1)}M`
  }
  if (amount >= 1_000) {
    return `TZS ${(amount / 1_000).toFixed(0)}K`
  }
  return formatTZS(amount)
}
