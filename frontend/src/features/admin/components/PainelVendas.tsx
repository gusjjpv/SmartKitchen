import { useMemo } from 'react'
import { useListarPedidos, useAtualizarStatusPedido } from '@/hooks/usePedidos'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw, Smartphone, Clock, ChefHat, UtensilsCrossed, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import type { StatusPedido, Pedido } from '@/types'

interface PainelVendasProps {
  restauranteId: string
}

const STATUS_ORDER: StatusPedido[] = ['RECEBIDO', 'EM_PREPARO', 'PRONTO']
const STATUS_LABEL: Record<StatusPedido, string> = {
  RECEBIDO: 'Recebido',
  EM_PREPARO: 'Em Preparo',
  PRONTO: 'Pronto',
  ENTREGUE: 'Entregue',
}
const STATUS_COLOR: Record<StatusPedido, string> = {
  RECEBIDO: 'border-l-yellow-500 bg-yellow-500/5',
  EM_PREPARO: 'border-l-blue-500 bg-blue-500/5',
  PRONTO: 'border-l-green-500 bg-green-500/5',
  ENTREGUE: 'border-l-muted bg-muted/10',
}
const STATUS_NEXT: Record<StatusPedido, StatusPedido | null> = {
  RECEBIDO: 'EM_PREPARO',
  EM_PREPARO: 'PRONTO',
  PRONTO: 'ENTREGUE',
  ENTREGUE: null,
}
const STATUS_ICON: Record<StatusPedido, typeof ChefHat> = {
  RECEBIDO: ChefHat,
  EM_PREPARO: UtensilsCrossed,
  PRONTO: CheckCircle2,
  ENTREGUE: CheckCircle2,
}

function formatarHora(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function CardPedido({
  pedido,
  onAvancar,
  avancando,
}: {
  pedido: Pedido
  onAvancar: (pedidoId: string, status: StatusPedido) => void
  avancando: boolean
}) {
  const NextIcon = STATUS_ICON[pedido.status]
  const next = STATUS_NEXT[pedido.status]

  return (
    <Card className={`border-l-4 ${STATUS_COLOR[pedido.status]} border border-border/50 bg-card/60 backdrop-blur-md shadow-sm transition-all duration-200 hover:shadow-md`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-laranja/10">
              <Smartphone className="size-5 text-laranja" />
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">Mesa {pedido.mesa.numero}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2.5 py-0.5 text-[10px] text-muted-foreground">
              <Clock className="size-3" />
              {formatarHora(pedido.criado_em)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-laranja/10 px-2.5 py-0.5 text-[11px] font-semibold text-laranja">
              <NextIcon className="size-3" />
              {STATUS_LABEL[pedido.status]}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          {pedido.itens.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg bg-background/50 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-laranja/10 text-[11px] font-bold text-laranja">
                  {item.quantidade}
                </span>
                <span className="truncate text-foreground">
                  {item.produto?.nome ?? 'Produto removido'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {next && (
          <Button
            size="sm"
            onClick={() => onAvancar(pedido.id, next)}
            disabled={avancando}
            className="mt-4 w-full h-9 text-xs font-semibold"
          >
            {avancando ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <ChefHat className="size-3.5" />
            )}
            Avançar para {STATUS_LABEL[next]}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function PainelVendas({ restauranteId }: PainelVendasProps) {
  const { data: pedidos, isLoading, isFetching, refetch } = useListarPedidos(restauranteId)
  const mutation = useAtualizarStatusPedido(restauranteId)

  const ativos = useMemo(
    () => (pedidos ?? []).filter((p) => p.status !== 'ENTREGUE'),
    [pedidos],
  )

  const agrupados = useMemo(() => {
    const grupos: Record<StatusPedido, Pedido[]> = {
      RECEBIDO: [],
      EM_PREPARO: [],
      PRONTO: [],
      ENTREGUE: [],
    }
    for (const p of ativos) {
      grupos[p.status].push(p)
    }
    for (const key of Object.keys(grupos)) {
      grupos[key as StatusPedido].sort(
        (a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime(),
      )
    }
    return grupos
  }, [ativos])

  async function handleAvancar(pedidoId: string, status: StatusPedido) {
    try {
      await mutation.mutateAsync({ pedidoId, status })
      toast.success(`Pedido movido para ${STATUS_LABEL[status]}`)
    } catch {
      toast.error('Erro ao atualizar status do pedido')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const totalAtivos = ativos.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">Pedidos Ativos</h2>
          <span className="rounded-full bg-laranja/10 px-2 py-0.5 text-[11px] font-semibold text-laranja">
            {totalAtivos}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-8 text-xs"
        >
          <RefreshCw className={`size-3.5 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {totalAtivos === 0 ? (
        <Card className="border border-border/30 bg-card/40">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle2 className="size-10 text-green-500/40" />
            <p className="mt-4 text-sm text-muted-foreground">Nenhum pedido pendente no momento</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {STATUS_ORDER.map((status) => {
            const lista = agrupados[status]
            if (lista.length === 0) return null
            return (
              <div key={status} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    status === 'RECEBIDO' ? 'bg-yellow-500/10 text-yellow-600' :
                    status === 'EM_PREPARO' ? 'bg-blue-500/10 text-blue-600' :
                    'bg-green-500/10 text-green-600'
                  }`}>
                    {STATUS_LABEL[status]}
                  </span>
                  <span className="text-[11px] text-muted-foreground/50">
                    ({lista.length})
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {lista.map((pedido) => (
                    <CardPedido
                      key={pedido.id}
                      pedido={pedido}
                      onAvancar={handleAvancar}
                      avancando={mutation.isPending}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
