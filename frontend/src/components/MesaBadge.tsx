import { useMesa } from '@/contexts/MesaContext'
import { Store, Smartphone } from 'lucide-react'

interface MesaBadgeProps {
  restauranteNome?: string
}

export function MesaBadge({ restauranteNome }: MesaBadgeProps) {
  const { mesa } = useMesa()

  if (!mesa) return null

  return (
    <div className="sticky top-0 z-40 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-laranja to-laranja/80">
            <Store className="size-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-foreground truncate">
            {restauranteNome ?? 'Cardápio'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-laranja/10 px-3 py-1 shrink-0">
          <Smartphone className="size-3.5 text-laranja" />
          <span className="text-xs font-bold text-laranja">Mesa {mesa}</span>
        </div>
      </div>
    </div>
  )
}
