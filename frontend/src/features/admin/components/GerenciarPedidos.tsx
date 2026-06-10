import { useMemo, useState } from 'react'
import { useListarPedidos, useAtualizarStatusPedido } from '@/hooks/usePedidos'
import { useListarMesas } from '@/hooks/useMesaAdmin'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, RefreshCw, Clock, ChefHat, UtensilsCrossed, CheckCircle2, History, ArrowRight, Smartphone, Filter } from 'lucide-react'
import { toast } from 'sonner'
import type { StatusPedido, Pedido } from '@/types'

interface GerenciarPedidosProps {
  restauranteId: string
}

const COLUNAS_ATIVAS: StatusPedido[] = ['RECEBIDO', 'EM_PREPARO', 'PRONTO']

const STATUS_CONFIG = {
  RECEBIDO: {
    label: 'Recebido',
    icon: ChefHat,
    headerColor: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    cardBorder: 'border-l-yellow-500',
    next: 'EM_PREPARO' as StatusPedido,
  },
  EM_PREPARO: {
    label: 'Em Preparo',
    icon: UtensilsCrossed,
    headerColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    cardBorder: 'border-l-blue-500',
    next: 'PRONTO' as StatusPedido,
  },
  PRONTO: {
    label: 'Pronto',
    icon: CheckCircle2,
    headerColor: 'bg-green-500/10 text-green-600 border-green-500/20',
    cardBorder: 'border-l-green-500',
    next: 'ENTREGUE' as StatusPedido,
  },
  ENTREGUE: {
    label: 'Entregue',
    icon: CheckCircle2,
    headerColor: 'bg-muted/30 text-muted-foreground border-border/30',
    cardBorder: 'border-l-muted',
    next: null,
  },
} as const

function formatarHora(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function PedidoCard({
  pedido,
  onAvancar,
  avancando,
}: {
  pedido: Pedido
  onAvancar: (pedidoId: string, status: StatusPedido) => void
  avancando: boolean
}) {
  const config = STATUS_CONFIG[pedido.status]
  const next = config.next

  return (
    <Card interactive className={`${config.cardBorder} border-l-4 border border-border/50 bg-card/60 backdrop-blur-md shadow-sm`}>
      <CardContent className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-laranja/10">
              <Smartphone className="size-4 text-laranja" />
            </div>
            <span className="text-xl font-bold text-foreground">Mesa {pedido.mesa.numero}</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground shrink-0">
            <Clock className="size-2.5" />
            {formatarHora(pedido.criado_em)}
          </span>
        </div>

        <div className="mt-3 space-y-1">
          {pedido.itens.map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-md bg-background/50 px-2.5 py-1.5 text-sm">
              <span className="flex size-5 shrink-0 items-center justify-center rounded bg-laranja/10 text-[10px] font-bold text-laranja">
                {item.quantidade}
              </span>
              <span className="truncate text-foreground text-xs">
                {item.produto?.nome ?? 'Produto removido'}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">
            {pedido.itens.reduce((acc, i) => acc + i.quantidade * Number(i.preco_unitario), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>

          {next && (
            <Button
              size="sm"
              onClick={() => onAvancar(pedido.id, next)}
              disabled={avancando}
              className="h-8 text-xs font-semibold"
            >
              {avancando ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <ArrowRight className="size-3" />
              )}
              {STATUS_CONFIG[next].label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function HistoryCard({ pedido }: { pedido: Pedido }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/30 bg-card/30 px-3.5 py-2.5 text-sm">
      <div className="flex size-8 items-center justify-center rounded-lg bg-muted/30">
        <Smartphone className="size-3.5 text-muted-foreground/50" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="font-semibold text-foreground">Mesa {pedido.mesa.numero}</span>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground/60">
          <span>{formatarHora(pedido.criado_em)}</span>
          <span>{pedido.itens.length} item(ns)</span>
          <span>Total: {pedido.itens.reduce((acc, i) => acc + i.quantidade * Number(i.preco_unitario), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground shrink-0">
        {formatarHora(pedido.atualizado_em)}
      </span>
    </div>
  )
}

export function GerenciarPedidos({ restauranteId }: GerenciarPedidosProps) {
  const { data: mesas } = useListarMesas(restauranteId)
  const { data: pedidos, isLoading, isFetching, refetch } = useListarPedidos(restauranteId)
  const mutation = useAtualizarStatusPedido(restauranteId)
  const [aba, setAba] = useState('ativos')
  const [mesaFiltro, setMesaFiltro] = useState('todas')

  const pedidosFiltrados = useMemo(() => {
    if (!pedidos) return []
    if (mesaFiltro === 'todas') return pedidos
    return pedidos.filter((p) => p.mesa.numero === mesaFiltro)
  }, [pedidos, mesaFiltro])

  const ativos = useMemo(
    () => pedidosFiltrados.filter((p) => p.status !== 'ENTREGUE'),
    [pedidosFiltrados],
  )

  const historico = useMemo(
    () => pedidosFiltrados.filter((p) => p.status === 'ENTREGUE'),
    [pedidosFiltrados],
  )

  const colunas = useMemo(() => {
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
      toast.success(`Pedido movido para ${STATUS_CONFIG[status].label}`)
    } catch (err) {
      const msg =
        (err as { response?: { data?: { erro?: string } } })?.response?.data?.erro
        ?? 'Erro ao atualizar status do pedido'
      toast.error(msg)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={aba} onValueChange={setAba} className="w-auto">
          <TabsList className="rounded-lg bg-muted/30 p-0.5">
            <TabsTrigger value="ativos" className="text-xs px-3 py-1.5 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <ChefHat className="size-3.5 mr-1" />
              Ativos
              {ativos.length > 0 && (
                <span className="ml-1.5 rounded-full bg-laranja/10 px-1.5 py-0.5 text-[10px] font-semibold text-laranja">
                  {ativos.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="historico" className="text-xs px-3 py-1.5 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <History className="size-3.5 mr-1" />
              Histórico
              {historico.length > 0 && (
                <span className="ml-1.5 rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {historico.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className="size-3.5 text-muted-foreground" />
            <Select value={mesaFiltro} onValueChange={setMesaFiltro}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas" className="text-xs">Todas as mesas</SelectItem>
                {mesas?.map((m) => (
                  <SelectItem key={m.id} value={m.numero} className="text-xs">
                    Mesa {m.numero}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      </div>

      {aba === 'ativos' && (
        <>
          {ativos.length === 0 ? (
            <Card className="border border-border/30 bg-card/40">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <CheckCircle2 className="size-10 text-green-500/40" />
                <p className="mt-4 text-sm text-muted-foreground">Nenhum pedido pendente no momento</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 snap-x">
              {COLUNAS_ATIVAS.map((status) => {
                const lista = colunas[status]
                const config = STATUS_CONFIG[status]
                return (
                  <div
                    key={status}
                    className="flex min-w-[280px] max-w-[320px] flex-1 flex-col gap-3 snap-start"
                  >
                    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${config.headerColor}`}>
                      {(() => {
                        const Icon = config.icon
                        return <Icon className="size-4" />
                      })()}
                      <span className="text-xs font-semibold uppercase tracking-wider">{config.label}</span>
                      <span className="ml-auto text-[11px] opacity-60">{lista.length}</span>
                    </div>

                    {lista.length === 0 ? (
                      <div className="flex items-center justify-center rounded-lg border border-dashed border-border/30 py-8">
                        <p className="text-xs text-muted-foreground/40">Nenhum pedido</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {lista.map((pedido) => (
                          <PedidoCard
                            key={pedido.id}
                            pedido={pedido}
                            onAvancar={handleAvancar}
                            avancando={mutation.isPending}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {aba === 'historico' && (
        <>
          {historico.length === 0 ? (
            <Card className="border border-border/30 bg-card/40">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <History className="size-10 text-muted-foreground/30" />
                <p className="mt-4 text-sm text-muted-foreground">Nenhum pedido finalizado ainda</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-1.5">
              {historico
                .sort((a, b) => new Date(b.atualizado_em).getTime() - new Date(a.atualizado_em).getTime())
                .map((pedido) => (
                  <HistoryCard key={pedido.id} pedido={pedido} />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
