import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useMesa } from '@/contexts/MesaContext'
import { MesaBadge } from '@/components/MesaBadge'
import { obterPedido } from '@/api/pedidos'
import { STATUS_PEDIDO_LABEL, STATUS_PEDIDO_ORDER, type StatusPedido } from '@/types'
import { CheckCircle2, ArrowLeft, Loader2, Timer, ChefHat, Utensils, PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

const STATUS_CONFIG: Record<StatusPedido, { icon: typeof Timer; color: string }> = {
  RECEBIDO: { icon: Timer, color: 'text-blue-500 bg-blue-500/10' },
  EM_PREPARO: { icon: ChefHat, color: 'text-laranja bg-laranja/10' },
  PRONTO: { icon: Utensils, color: 'text-verde bg-verde/10' },
  ENTREGUE: { icon: PartyPopper, color: 'text-verde bg-verde/10' },
}

function PedidoStatusStepper({ status }: { status: StatusPedido }) {
  const currentIdx = STATUS_PEDIDO_ORDER.indexOf(status)

  return (
    <div className="flex items-start justify-center gap-0 sm:gap-2">
      {STATUS_PEDIDO_ORDER.map((s, i) => {
        const Icon = STATUS_CONFIG[s].icon
        const done = i <= currentIdx
        return (
          <div key={s} className="flex items-center gap-0 sm:gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex size-8 sm:size-10 items-center justify-center rounded-full transition-all duration-500 ${
                  done
                    ? i === currentIdx
                      ? 'bg-laranja text-white shadow-lg shadow-laranja/30 scale-110'
                      : 'bg-verde/20 text-verde'
                    : 'bg-muted/30 text-muted-foreground/40'
                }`}
              >
                <Icon className="size-4 sm:size-5" />
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                  done ? 'text-foreground' : 'text-muted-foreground/40'
                }`}
              >
                {STATUS_PEDIDO_LABEL[s]}
              </span>
            </div>
            {i < STATUS_PEDIDO_ORDER.length - 1 && (
              <div
                className={`h-0.5 w-6 sm:w-10 rounded-full transition-all duration-500 ${
                  i < currentIdx ? 'bg-verde/50' : 'bg-muted/30'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function PedidoConfirmadoPage() {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const { mesa } = useMesa()
  const [searchParams] = useSearchParams()

  const urlPedidoId = searchParams.get('pedido_id')
  const urlRestauranteId = searchParams.get('restaurante_id')

  const { pedidoId, restauranteId } = useMemo(() => {
    if (urlPedidoId && urlRestauranteId) {
      return { pedidoId: urlPedidoId, restauranteId: urlRestauranteId }
    }
    try {
      const stored = localStorage.getItem(`ultimo_pedido_${slug}_${mesa}`)
      if (stored) {
        const data = JSON.parse(stored)
        return {
          pedidoId: urlPedidoId ?? data.id ?? null,
          restauranteId: urlRestauranteId ?? data.restaurante_id ?? null,
        }
      }
    } catch {
      return { pedidoId: null, restauranteId: null }
    }
    return { pedidoId: null, restauranteId: null }
  }, [urlPedidoId, urlRestauranteId, slug, mesa])

  const { data: pedido, isLoading, isError } = useQuery({
    queryKey: ['pedido', pedidoId],
    queryFn: () => obterPedido(restauranteId!, pedidoId!),
    enabled: !!pedidoId && !!restauranteId,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (!status || status === 'ENTREGUE' || status === 'PRONTO') return false
      return 15000
    },
  })

  if (!pedidoId) {
    return (
      <main className="min-h-screen bg-background">
        <MesaBadge />
        <div className="flex flex-col items-center justify-center px-4 py-24">
          <p className="text-sm text-muted-foreground">Nenhum pedido encontrado</p>
          <Button
            onClick={() => navigate(`/cardapio/${slug}?mesa=${mesa}`)}
            className="mt-4"
          >
            Voltar ao cardápio
          </Button>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background" role="status" aria-live="polite">
        <MesaBadge />
        <div className="flex flex-col items-center justify-center px-4 py-24">
          <Loader2 className="size-8 animate-spin text-laranja" />
          <p className="mt-4 text-sm text-muted-foreground animate-pulse">Carregando pedido...</p>
        </div>
      </main>
    )
  }

  if (isError || !pedido) {
    return (
      <main className="min-h-screen bg-background">
        <MesaBadge />
        <div className="flex flex-col items-center justify-center px-4 py-24">
          <p className="text-sm text-muted-foreground">Erro ao carregar pedido</p>
          <Button
            onClick={() => navigate(`/cardapio/${slug}?mesa=${mesa}`)}
            className="mt-4"
          >
            Voltar ao cardápio
          </Button>
        </div>
      </main>
    )
  }

  const status = pedido.status as StatusPedido
  const statusText = STATUS_PEDIDO_LABEL[status]
  const StatusIcon = STATUS_CONFIG[status].icon

  return (
    <main className="min-h-screen bg-background">
      <MesaBadge />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <div className="space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="size-10 text-green-500" />
            </div>
            <h1 className="mt-6 text-xl font-bold text-foreground">Pedido confirmado!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Seu pedido foi enviado para a cozinha{mesa && <> da Mesa {mesa}</>}
            </p>
          </div>

          <div className="flex justify-center py-4">
            <PedidoStatusStepper status={status} />
          </div>

          <Card className="text-center p-5">
            <div className={`mx-auto mb-3 flex size-12 items-center justify-center rounded-full ${STATUS_CONFIG[status].color}`}>
              <StatusIcon className="size-6" />
            </div>
            <p className="text-xs text-muted-foreground">Status atual</p>
            <p className="mt-1 text-lg font-bold text-foreground">{statusText}</p>
          </Card>

          <Card className="text-center p-5">
            <p className="text-xs text-muted-foreground">Total do pedido</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {Number(pedido.total).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
          </Card>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Itens</h3>
            {pedido.itens.map((item) => (
              <Card key={item.id} className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  {item.produto?.foto_base64 ? (
                    <img
                      src={item.produto.foto_base64}
                      alt={item.produto.nome}
                      className="size-10 rounded-lg border border-border/30 object-cover shrink-0"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted/20 shrink-0">
                      <CheckCircle2 className="size-4 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.produto?.nome ?? 'Produto'}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      {item.quantidade}x{' '}
                      {Number(item.preco_unitario).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground shrink-0 ml-2">
                  {Number(item.preco_unitario * item.quantidade).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </Card>
            ))}
          </div>

          <Button
            onClick={() => navigate(`/cardapio/${slug}?mesa=${mesa}`)}
            variant="glow"
            className="w-full"
          >
            <ArrowLeft className="size-4" />
            Fazer novo pedido
          </Button>
        </div>
      </div>
    </main>
  )
}
