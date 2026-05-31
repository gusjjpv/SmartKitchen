import { useNavigate } from 'react-router-dom'
import { useListarRestaurantes } from '@/hooks/useRestaurante'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Plus, Store, MapPin, Phone, Pencil, UtensilsCrossed } from 'lucide-react'
import type { Restaurante } from '@/types'

function RestauranteCard({ restaurante }: { restaurante: Restaurante }) {
  const navigate = useNavigate()

  return (
    <Card className="border-l-4 border-l-laranja shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {restaurante.logo_base64 ? (
            <img
              src={restaurante.logo_base64}
              alt={restaurante.nome}
              className="size-16 shrink-0 rounded-xl border object-cover"
            />
          ) : (
            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
              <UtensilsCrossed className="size-6 text-muted-foreground/40" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground truncate">{restaurante.nome}</h3>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3 shrink-0" />
                  {restaurante.cidade}{restaurante.estado ? `, ${restaurante.estado}` : ''}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                  restaurante.ativo
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                }`}
              >
                {restaurante.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            {restaurante.descricao && (
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{restaurante.descricao}</p>
            )}

            <div className="mt-3 flex items-center justify-between gap-2">
              <a
                href={`https://wa.me/${restaurante.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-verde hover:text-verde/80 hover:underline"
              >
                <Phone className="size-3" />
                {restaurante.whatsapp}
              </a>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => navigate(`/admin?id=${restaurante.id}`)}
              >
                <Pencil className="size-3" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function RestauranteListPage() {
  const navigate = useNavigate()
  const { data: restaurantes, isLoading } = useListarRestaurantes()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-laranja" />
          <p className="text-sm text-muted-foreground">Carregando restaurantes...</p>
        </div>
      </div>
    )
  }

  const temRestaurantes = restaurantes && restaurantes.length > 0

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-laranja/10 shadow-sm">
            <Store className="size-6 text-laranja" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Restaurantes</h1>
            <p className="text-sm text-muted-foreground">
              {temRestaurantes
                ? `${restaurantes!.length} restaurante${restaurantes!.length > 1 ? 's' : ''} cadastrado${restaurantes!.length > 1 ? 's' : ''}`
                : 'Nenhum restaurante cadastrado'}
            </p>
          </div>
        </div>

        <Button size="sm" onClick={() => navigate('/admin')}>
          <Plus className="size-4" />
          Novo Restaurante
        </Button>
      </div>

      {temRestaurantes ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {restaurantes!.map((r) => (
            <RestauranteCard key={r.id} restaurante={r} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 py-20">
          <Store className="mb-4 size-12 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">Nenhum restaurante cadastrado</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Crie seu primeiro restaurante para começar</p>
          <Button className="mt-6" onClick={() => navigate('/admin')}>
            <Plus className="size-4" />
            Criar primeiro restaurante
          </Button>
        </div>
      )}
    </div>
  )
}
