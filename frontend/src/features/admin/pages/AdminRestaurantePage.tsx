import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DadosRestauranteForm } from '../components/DadosRestauranteForm'
import { HorariosEditor } from '../components/HorariosEditor'
import { CardapioEditor } from '../components/CardapioEditor'
import { GerenciarMesas } from '../components/GerenciarMesas'
import { PainelVendas } from '../components/PainelVendas'
import { useListarRestaurantes, useCriarRestaurante, useAtualizarRestaurante } from '@/hooks/useRestaurante'
import type { CriarRestauranteDTO } from '@/types'
import { toast } from 'sonner'
import { Plus, Store, ArrowLeft, UtensilsCrossed, Clock, Smartphone, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AdminRestaurantePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data: restaurantes, isLoading: isLoadingLista } = useListarRestaurantes()
  const criarMutation = useCriarRestaurante()
  const atualizarMutation = useAtualizarRestaurante()

  const [activeTab, setActiveTab] = useState('dados')
  const [criandoNovo, setCriandoNovo] = useState(false)

  const urlId = searchParams.get('id')
  const restaurante = criandoNovo
    ? null
    : (urlId ? restaurantes?.find((r) => r.id === urlId) ?? null : null)

  function gerarSlug(nome: string) {
    return nome
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .replace(/-+/g, '-')
  }

  async function handleSave(data: {
    logo_base64?: string | null
    admin_usuario_id: string
    nome: string
    descricao?: string
    whatsapp: string
    email?: string
    rua: string
    numero: string
    bairro: string
    cidade: string
    estado?: string
    cep?: string
  }) {
    try {
      const slug = restaurante?.slug ?? gerarSlug(data.nome)
      const payload = { ...data, slug }

      if (restaurante) {
        await atualizarMutation.mutateAsync({ id: restaurante.id, dto: payload })
        toast.success('Restaurante atualizado com sucesso!')
      } else {
        await criarMutation.mutateAsync(payload as CriarRestauranteDTO)
        toast.success('Restaurante criado com sucesso!')
        navigate('/restaurantes')
      }
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } } | undefined
      const message = axiosError?.response?.data?.message || 'Erro ao salvar restaurante'
      toast.error(message)
    }
  }

  function handleCriarNovo() {
    setCriandoNovo(true)
    setActiveTab('dados')
  }

  if (isLoadingLista) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-laranja/20 border-t-laranja animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-laranja/20 to-laranja/5 shadow-sm">
            <Store className="size-6 text-laranja" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
              {restaurante ? restaurante.nome : 'Novo Restaurante'}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {restaurante
                ? 'Edite as informações do seu restaurante'
                : 'Cadastre seu restaurante para começar'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/restaurantes')}>
            <ArrowLeft className="size-4" />
            Voltar
          </Button>

          {restaurante && (
            <Button variant="secondary" size="sm" onClick={handleCriarNovo} className="h-9 sm:h-8">
              <Plus className="size-4" />
              <span className="hidden sm:inline">Novo</span>
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start rounded-xl bg-muted/30 p-1 gap-0.5 overflow-x-auto">
          <TabsTrigger value="dados" className="data-[state=active]:border-b-2 data-[state=active]:border-laranja data-[state=active]:text-laranja rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs sm:text-sm px-2.5 sm:px-3 py-2 sm:py-1">
            <UtensilsCrossed className="mr-1.5 size-3.5 sm:size-4 shrink-0" />
            <span className="hidden sm:inline">Dados do Restaurante</span>
            <span className="sm:hidden">Dados</span>
          </TabsTrigger>
          <TabsTrigger value="horarios" disabled={!restaurante} className="data-[state=active]:border-b-2 data-[state=active]:border-laranja data-[state=active]:text-laranja rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs sm:text-sm px-2.5 sm:px-3 py-2 sm:py-1">
            <Clock className="mr-1.5 size-3.5 sm:size-4 shrink-0" />
            <span className="hidden sm:inline">Horários</span>
            <span className="sm:hidden">Horários</span>
          </TabsTrigger>
          <TabsTrigger value="cardapio" disabled={!restaurante} className="data-[state=active]:border-b-2 data-[state=active]:border-laranja data-[state=active]:text-laranja rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs sm:text-sm px-2.5 sm:px-3 py-2 sm:py-1">
            <Store className="mr-1.5 size-3.5 sm:size-4 shrink-0" />
            Cardápio
          </TabsTrigger>
          <TabsTrigger value="pedidos" disabled={!restaurante} className="data-[state=active]:border-b-2 data-[state=active]:border-laranja data-[state=active]:text-laranja rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs sm:text-sm px-2.5 sm:px-3 py-2 sm:py-1">
            <ClipboardList className="mr-1.5 size-3.5 sm:size-4 shrink-0" />
            <span className="hidden sm:inline">Pedidos</span>
            <span className="sm:hidden">Pedidos</span>
          </TabsTrigger>
          <TabsTrigger value="mesas" disabled={!restaurante} className="data-[state=active]:border-b-2 data-[state=active]:border-laranja data-[state=active]:text-laranja rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs sm:text-sm px-2.5 sm:px-3 py-2 sm:py-1">
            <Smartphone className="mr-1.5 size-3.5 sm:size-4 shrink-0" />
            <span className="hidden sm:inline">Mesas</span>
            <span className="sm:hidden">Mesas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="mt-6 transition-all duration-200 data-[state=inactive]:opacity-50">
          <DadosRestauranteForm
            key={restaurante?.id ?? 'new'}
            restaurante={restaurante}
            onSave={handleSave}
            isSaving={criarMutation.isPending || atualizarMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="horarios" className="mt-6 transition-all duration-200 data-[state=inactive]:opacity-50">
          {restaurante && <HorariosEditor restauranteId={restaurante.id} />}
        </TabsContent>

        <TabsContent value="cardapio" className="mt-6 transition-all duration-200 data-[state=inactive]:opacity-50">
          {restaurante && <CardapioEditor restauranteId={restaurante.id} />}
        </TabsContent>
        <TabsContent value="pedidos" className="mt-6 transition-all duration-200 data-[state=inactive]:opacity-50">
          {restaurante && <PainelVendas restauranteId={restaurante.id} />}
        </TabsContent>
        <TabsContent value="mesas" className="mt-6 transition-all duration-200 data-[state=inactive]:opacity-50">
          {restaurante && <GerenciarMesas restauranteId={restaurante.id} slug={restaurante.slug} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}
