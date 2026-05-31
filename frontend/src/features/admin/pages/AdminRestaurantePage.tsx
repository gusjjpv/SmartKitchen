import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DadosRestauranteForm } from '../components/DadosRestauranteForm'
import { HorariosEditor } from '../components/HorariosEditor'
import { useListarRestaurantes, useCriarRestaurante, useAtualizarRestaurante } from '@/hooks/useRestaurante'
import type { CriarRestauranteDTO } from '@/types'
import { toast } from 'sonner'
import { Loader2, Plus, Store, UtensilsCrossed, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AdminRestaurantePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
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
        const novo = await criarMutation.mutateAsync(payload as CriarRestauranteDTO)
        setSearchParams({ id: novo.id }, { replace: true })
        setCriandoNovo(false)
        toast.success('Restaurante criado com sucesso!')
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
          <Loader2 className="size-8 animate-spin text-laranja" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-laranja/10 shadow-sm">
            <Store className="size-6 text-laranja" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {restaurante ? restaurante.nome : 'Novo Restaurante'}
            </h1>
            <p className="text-sm text-muted-foreground">
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
            <Button variant="secondary" size="sm" onClick={handleCriarNovo}>
              <Plus className="size-4" />
              Novo Restaurante
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start rounded-xl bg-gradient-to-r from-areia/30 to-transparent">
          <TabsTrigger value="dados" className="data-[state=active]:border-b-2 data-[state=active]:border-laranja data-[state=active]:text-laranja rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            <UtensilsCrossed className="mr-1.5 size-4" />
            Dados do Restaurante
          </TabsTrigger>
          <TabsTrigger value="horarios" disabled={!restaurante} className="data-[state=active]:border-b-2 data-[state=active]:border-laranja data-[state=active]:text-laranja rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            Horários de Funcionamento
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
      </Tabs>
    </div>
  )
}
