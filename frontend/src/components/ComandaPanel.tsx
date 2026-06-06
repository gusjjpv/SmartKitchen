import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useComanda } from '@/contexts/ComandaContext'
import { useMesa } from '@/contexts/MesaContext'
import { ShoppingBag, Plus, Minus, Trash2, X, ImageIcon, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

function formatarPreco(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

interface ComandaPanelProps {
  restauranteId: string
  mesaId: string
}

export function ComandaPanel({ restauranteId, mesaId }: ComandaPanelProps) {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const { mesa } = useMesa()
  const { itens, confirmarPedido, remover, atualizarQuantidade, limpar, total, totalItens } = useComanda()
  const [aberto, setAberto] = useState(false)
  const [enviando, setEnviando] = useState(false)

  if (!mesa || itens.length === 0 && !aberto) return null

  return (
    <>
      {!aberto && itens.length > 0 && (
        <button
          onClick={() => setAberto(true)}
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-fade-in"
        >
          <div className="flex items-center gap-3 rounded-full border border-border/50 bg-card px-5 py-3 shadow-lg backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95">
            <div className="relative">
              <ShoppingBag className="size-5 text-laranja" />
              <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-laranja text-[9px] font-bold text-white">
                {totalItens}
              </span>
            </div>
            <span className="text-sm font-semibold text-foreground">{formatarPreco(total)}</span>
            <span className="text-xs text-muted-foreground/60">Ver comanda</span>
          </div>
        </button>
      )}

      <div
        data-state={aberto ? 'open' : 'closed'}
        className="fixed inset-0 z-50 flex flex-col bg-background/80 backdrop-blur-sm data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0 data-[state=open]:opacity-100 transition-opacity duration-200"
        onClick={() => setAberto(false)}
      >
        <div
          data-state={aberto ? 'open' : 'closed'}
          className="mt-auto flex max-h-[80vh] flex-col rounded-t-2xl border border-border/50 bg-card shadow-xl data-[state=closed]:translate-y-full data-[state=open]:translate-y-0 transition-transform duration-300 ease-out"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-5 text-laranja" />
              <h2 className="text-sm font-bold text-foreground">Comanda</h2>
              <span className="rounded-full bg-laranja/10 px-2 py-0.5 text-[10px] font-semibold text-laranja">
                Mesa {mesa}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {itens.length > 0 && (
                <button
                  onClick={limpar}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
                  title="Limpar comanda"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
              <button
                onClick={() => setAberto(false)}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground/50 transition-colors hover:bg-muted/50 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {itens.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <ShoppingBag className="size-10 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground/60">Nenhum item na comanda</p>
              <p className="text-xs text-muted-foreground/40">
                Adicione produtos do cardápio
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-1 overflow-y-auto overscroll-contain px-5 py-3">
                {itens.map((item) => (
                  <div
                    key={item.produto_id}
                    className="flex items-center gap-3 rounded-lg border border-border/30 bg-background/50 p-3"
                  >
                    {item.foto_base64 ? (
                      <img
                        src={item.foto_base64}
                        alt={item.nome}
                        className="size-10 shrink-0 rounded-md border border-border/30 object-cover"
                      />
                    ) : (
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border/30 bg-muted/20">
                        <ImageIcon className="size-4 text-muted-foreground/30" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{item.nome}</p>
                      <p className="text-xs text-muted-foreground/60">
                        {formatarPreco(item.preco)} un
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => atualizarQuantidade(item.produto_id, -1)}
                        className="flex size-7 items-center justify-center rounded-md border border-border/30 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                        disabled={item.quantidade <= 1}
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="flex w-7 items-center justify-center text-sm font-semibold text-foreground">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => atualizarQuantidade(item.produto_id, 1)}
                        className="flex size-7 items-center justify-center rounded-md border border-border/30 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>

                    <div className="w-16 text-right">
                      <p className="text-sm font-bold text-foreground">
                        {formatarPreco(item.preco * item.quantidade)}
                      </p>
                    </div>

                    <button
                      onClick={() => remover(item.produto_id)}
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/50 px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-lg font-bold text-foreground">{formatarPreco(total)}</span>
                </div>
                <button
                  onClick={async () => {
                    setEnviando(true)
                    try {
                      await confirmarPedido(restauranteId, mesaId)
                      navigate(`/cardapio/${slug}/pedido-confirmado?mesa=${mesa}`)
                    } catch {
                      toast.error('Erro ao enviar pedido. Verifique sua conexão e tente novamente.')
                    } finally {
                      setEnviando(false)
                    }
                  }}
                  disabled={enviando || itens.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-laranja py-3 text-sm font-bold text-white shadow-lg shadow-laranja/20 transition-all duration-200 hover:bg-laranja/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {enviando ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4" />
                      Confirmar Pedido
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
