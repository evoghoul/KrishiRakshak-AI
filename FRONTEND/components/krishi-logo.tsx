import { Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KrishiLogoProps {
  className?: string
  markClassName?: string
  wordClassName?: string
  showWordmark?: boolean
}

export function KrishiLogo({
  className,
  markClassName,
  wordClassName,
  showWordmark = true,
}: KrishiLogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        className={cn(
          'flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm',
          markClassName,
        )}
      >
        <Sprout className="size-6" aria-hidden="true" />
      </span>
      {showWordmark && (
        <span
          className={cn(
            'text-xl font-bold tracking-tight text-foreground',
            wordClassName,
          )}
        >
          Krishi<span className="text-primary">Rakshak</span>
        </span>
      )}
    </div>
  )
}
