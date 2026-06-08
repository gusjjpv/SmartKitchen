import { useNavigate } from 'react-router-dom'
import { useListarRestaurantes } from '@/hooks/useRestaurante'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Store, MapPin, Phone, Pencil, Building2 } from 'lucide-react'
import type { Restaurante } from '@/types'

function RestauranteCard({ restaurante }: { restaurante: Restaurante }) {
  const navigate = useNavigate()

  return (
    <Card className="group border border-border/50 bg-card/60 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-laranja/30 hover:shadow-xl hover:shadow-laranja/5 hover:-translate-y-0.5">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {restaurante.logo_base64 ? (
            <div className="relative shrink-0">
              <img
                src={restaurante.logo_base64}
                alt={restaurante.nome}
                className="size-16 rounded-xl border border-border/50 object-cover shadow-sm"
              />
            </div>
          ) : (
            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-muted/30">
              <Building2 className="size-7 text-muted-foreground/30" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground truncate group-hover:text-laranja transition-colors">{restaurante.nome}</h3>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3 shrink-0" />
                  {restaurante.cidade}{restaurante.estado ? `, ${restaurante.estado}` : ''}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                  restaurante.ativo
                    ? 'bg-verde/10 text-verde'
                    : 'bg-destructive/10 text-destructive'
                }`}
              >
                {restaurante.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            {restaurante.descricao && (
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground/80">{restaurante.descricao}</p>
            )}

            <div className="mt-3 flex items-center justify-between gap-2">
              <a
                href={`https://wa.me/${restaurante.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-verde hover:text-verde/80 hover:underline transition-colors"
              >
                <Phone className="size-3" />
                {restaurante.whatsapp}
              </a>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
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

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="size-16 rounded-xl bg-muted/50" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-3/4 rounded bg-muted/50" />
          <div className="h-3 w-1/2 rounded bg-muted/30" />
          <div className="h-3 w-full rounded bg-muted/30" />
        </div>
      </div>
    </div>
  )
}

export function RestauranteListPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: restaurantes, isLoading } = useListarRestaurantes({ admin_usuario_id: user?.id })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-8 w-48 rounded-lg bg-muted/50 animate-pulse" />
            <div className="h-4 w-32 rounded bg-muted/30 animate-pulse" />
          </div>
          <div className="h-9 w-36 rounded-md bg-muted/50 animate-pulse" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  const temRestaurantes = restaurantes && restaurantes.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-laranja/20 to-laranja/5 shadow-sm">
            <Store className="size-6 text-laranja" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">Restaurantes</h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {temRestaurantes
                ? `${restaurantes!.length} restaurante${restaurantes!.length > 1 ? 's' : ''} cadastrado${restaurantes!.length > 1 ? 's' : ''}`
                : 'Nenhum restaurante cadastrado'}
            </p>
          </div>
        </div>

        <Button size="default" className="w-full sm:w-auto h-10 sm:h-9" onClick={() => navigate('/admin')}>
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
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-muted/10 py-20">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted/30">
            <Store className="size-8 text-muted-foreground/30" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Nenhum restaurante cadastrado</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Crie seu primeiro restaurante para começar</p>
          <Button className="mt-6 shadow-lg shadow-laranja/20" onClick={() => navigate('/admin')}>
            <Plus className="size-4" />
            Criar primeiro restaurante
          </Button>
        </div>
      )}
    </div>
  )
}
