import { useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { useMesa } from '@/contexts/MesaContext'
import { fetchCardapioPublico, type CardapioPublicResponse } from '@/api/cardapioPublic'
import { MesaBadge } from '@/components/MesaBadge'
import { NoMesaScreen } from '@/components/NoMesaScreen'
import { Store, Clock, ImageIcon, Smartphone } from 'lucide-react'

function formatarPreco(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'mesa_invalida' }
  | { status: 'success'; data: CardapioPublicResponse }

type Action =
  | { type: 'loading' }
  | { type: 'error' }
  | { type: 'mesa_invalida' }
  | { type: 'success'; data: CardapioPublicResponse }

function reducer(_: State, action: Action): State {
  switch (action.type) {
    case 'loading': return { status: 'loading' }
    case 'error': return { status: 'error' }
    case 'mesa_invalida': return { status: 'mesa_invalida' }
    case 'success': return { status: 'success', data: action.data }
  }
}

export function CardapioPublicPage() {
  const { slug } = useParams<{ slug: string }>()
  const { mesa } = useMesa()
  const [state, dispatch] = useReducer(reducer, { status: 'loading' })

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    dispatch({ type: 'loading' })
    fetchCardapioPublico(slug)
      .then((d) => {
        if (cancelled) return
        if (mesa && !d.mesas.some((m) => m.numero === String(mesa))) {
          dispatch({ type: 'mesa_invalida' })
        } else {
          dispatch({ type: 'success', data: d })
        }
      })
      .catch(() => { if (!cancelled) dispatch({ type: 'error' }) })
    return () => { cancelled = true }
  }, [slug, mesa])

  if (!mesa) return <NoMesaScreen />

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <MesaBadge />
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-6 animate-pulse">
          <div className="h-40 rounded-2xl bg-muted/50" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-24 rounded bg-muted/50" />
              <div className="h-20 rounded-xl bg-muted/30" />
              <div className="h-20 rounded-xl bg-muted/30" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="min-h-screen bg-background">
        <MesaBadge />
        <div className="flex flex-col items-center justify-center px-4 py-24">
          <Store className="size-12 text-muted-foreground/30" />
          <p className="mt-4 text-sm text-muted-foreground">Restaurante não encontrado</p>
        </div>
      </div>
    )
  }

  if (state.status === 'mesa_invalida') {
    return (
      <div className="min-h-screen bg-background">
        <MesaBadge />
        <div className="flex flex-col items-center justify-center px-4 py-24">
          <Smartphone className="size-12 text-muted-foreground/30" />
          <p className="mt-4 text-sm text-muted-foreground">Mesa não encontrada</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            O número da mesa informado não existe para este restaurante
          </p>
        </div>
      </div>
    )
  }

  const data = state.data

  return (
    <div className="min-h-screen bg-background">
      <MesaBadge restauranteNome={data.nome} />

      <div className="mx-auto max-w-2xl px-4 py-5 space-y-6">
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-5">
          <div className="flex items-start gap-4">
            {data.logo_base64 ? (
              <img
                src={data.logo_base64}
                alt={data.nome}
                className="size-16 shrink-0 rounded-xl border border-border/50 object-cover shadow-sm"
              />
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-muted/30">
                <Store className="size-7 text-muted-foreground/30" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-foreground">{data.nome}</h1>
              {data.descricao && (
                <p className="mt-0.5 text-xs text-muted-foreground/80 line-clamp-2">{data.descricao}</p>
              )}
              <div className="mt-2.5 flex flex-wrap gap-2">
                {data.horarios.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                    <Clock className="size-3" />
                    Hoje: {(() => {
                      const hoje = data.horarios[new Date().getDay()]
                      return hoje?.fechado ? 'Fechado' : `${hoje?.horario_abertura ?? '--'} às ${hoje?.horario_fechamento ?? '--'}`
                    })()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {data.categorias.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ImageIcon className="size-10 text-muted-foreground/20" />
            <p className="mt-3 text-sm text-muted-foreground">Cardápio em breve</p>
          </div>
        ) : (
          <div className="space-y-8">
            {data.categorias.map((cat) => (
              <section key={cat.id}>
                <div className="mb-3 flex items-center gap-2">
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">{cat.nome}</h2>
                  <span className="text-[10px] text-muted-foreground/50">({cat.produtos.length})</span>
                </div>

                {cat.produtos.length === 0 ? (
                  <p className="py-4 text-center text-xs text-muted-foreground/50">
                    Nenhum produto disponível nesta categoria
                  </p>
                ) : (
                  <div className="space-y-2">
                    {cat.produtos.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/40 p-3.5 transition-all duration-200 hover:border-laranja/20 hover:bg-card/60"
                      >
                        {prod.foto_base64 ? (
                          <img
                            src={prod.foto_base64}
                            alt={prod.nome}
                            className="size-14 shrink-0 rounded-lg border border-border/50 object-cover"
                          />
                        ) : (
                          <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted/20">
                            <ImageIcon className="size-5 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold text-foreground">{prod.nome}</h3>
                            <span className="shrink-0 text-sm font-bold text-laranja">{formatarPreco(prod.preco)}</span>
                          </div>
                          {prod.descricao && (
                            <p className="mt-0.5 text-xs text-muted-foreground/70 line-clamp-2">{prod.descricao}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 py-4 text-[10px] text-muted-foreground/30">
          <span className="h-px w-12 bg-border/50" />
          SmartKitchen
          <span className="h-px w-12 bg-border/50" />
        </div>
      </div>
    </div>
  )
}
