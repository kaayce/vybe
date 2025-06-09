import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const formatCurrency = (value: number): string => {
  if (value >= 1e9) {
    return `${formatter.format(value / 1e9)}B`
  }
  if (value >= 1e6) {
    return `${formatter.format(value / 1e6)}M`
  }
  return formatter.format(value)
}
