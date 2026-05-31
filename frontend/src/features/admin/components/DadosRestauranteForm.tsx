import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { LogoUpload } from './LogoUpload'
import type { Restaurante } from '@/types'
import { useEffect, useState } from 'react'
import { Save, Building2, MapPin, Loader2 } from 'lucide-react'

const restauranteSchema = z.object({
  admin_usuario_id: z.string().min(1, 'Admin é obrigatório'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  rua: z.string().min(1, 'Rua é obrigatória'),
  numero: z.string().min(1, 'Número é obrigatório'),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().optional(),
  cep: z.string().optional(),
})

type RestauranteFormData = z.infer<typeof restauranteSchema>

interface DadosRestauranteFormProps {
  restaurante?: Restaurante | null
  onSave: (data: RestauranteFormData & { logo_base64?: string | null }) => Promise<void>
  isSaving: boolean
}

export function DadosRestauranteForm({ restaurante, onSave, isSaving }: DadosRestauranteFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<RestauranteFormData>({
    resolver: zodResolver(restauranteSchema),
    defaultValues: {
        admin_usuario_id: '',
        nome: '',
        descricao: '',
      whatsapp: '',
      email: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
    },
  })

  useEffect(() => {
    if (restaurante) {
      reset({
        admin_usuario_id: restaurante.admin_usuario_id,
        nome: restaurante.nome,
        descricao: restaurante.descricao ?? '',
        whatsapp: restaurante.whatsapp,
        email: restaurante.email ?? '',
        rua: restaurante.rua,
        numero: restaurante.numero,
        bairro: restaurante.bairro,
        cidade: restaurante.cidade,
        estado: restaurante.estado ?? '',
        cep: restaurante.cep ?? '',
      })
    }
  }, [restaurante, reset])

  const [logoBase64, setLogoBase64] = useState<string | null>(restaurante?.logo_base64 ?? null)

  async function onSubmit(data: RestauranteFormData) {
    await onSave({ ...data, logo_base64: logoBase64 })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Identificação */}
      <Card className="border-l-4 border-l-laranja shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="size-4 text-laranja" />
            <h3 className="text-sm font-semibold text-marrom">Identificação</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <LogoUpload
                value={logoBase64}
                onChange={(v) => setLogoBase64(v)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_usuario_id">Admin (ID do usuario) *</Label>
              <Input
                id="admin_usuario_id"
                {...register('admin_usuario_id')}
                placeholder="UUID do usuario admin"
              />
              {errors.admin_usuario_id && (
                <p className="text-xs text-destructive">{errors.admin_usuario_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Restaurante *</Label>
              <Input id="nome" {...register('nome')} placeholder="Ex: Cantina do Luigi" />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" {...register('descricao')} rows={3} placeholder="Conte um pouco sobre o restaurante..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp *</Label>
              <Input id="whatsapp" {...register('whatsapp')} placeholder="5511999999999" />
              {errors.whatsapp && <p className="text-xs text-destructive">{errors.whatsapp.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} placeholder="contato@restaurante.com" />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card className="border-l-4 border-l-verde shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="size-4 text-verde" />
            <h3 className="text-sm font-semibold text-marrom">Endereço</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="rua">Rua *</Label>
              <Input id="rua" {...register('rua')} placeholder="Rua..." />
              {errors.rua && <p className="text-xs text-destructive">{errors.rua.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero">Número *</Label>
              <Input id="numero" {...register('numero')} placeholder="Nº" />
              {errors.numero && <p className="text-xs text-destructive">{errors.numero.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro *</Label>
              <Input id="bairro" {...register('bairro')} placeholder="Bairro..." />
              {errors.bairro && <p className="text-xs text-destructive">{errors.bairro.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input id="cidade" {...register('cidade')} placeholder="Cidade..." />
              {errors.cidade && <p className="text-xs text-destructive">{errors.cidade.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input id="estado" {...register('estado')} placeholder="SP" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" {...register('cep')} placeholder="00000-000" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {restaurante ? 'Altere os dados e salve' : 'Preencha os campos para criar'}
        </p>
        <Button type="submit" disabled={isSaving || (!isDirty && !!restaurante)}>
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="size-4" />
              {restaurante ? 'Atualizar Restaurante' : 'Criar Restaurante'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
