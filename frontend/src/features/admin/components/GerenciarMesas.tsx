import { useState } from 'react'
import { useListarMesas, useCriarMesa, useAtualizarMesa, useDeletarMesa, useRegenerarQrCode } from '@/hooks/useMesaAdmin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Loader2, Plus, Trash2, QrCode, Smartphone, CheckCircle2, XCircle, Download } from 'lucide-react'
import { toast } from 'sonner'
import type { Mesa } from '@/types'

interface GerenciarMesasProps {
  restauranteId: string
  slug: string
}

export function GerenciarMesas({ restauranteId, slug }: GerenciarMesasProps) {
  const { data: mesas, isLoading } = useListarMesas(restauranteId)
  const criarMutation = useCriarMesa()
  const atualizarMutation = useAtualizarMesa()
  const deletarMutation = useDeletarMesa()

  const regenMutation = useRegenerarQrCode()

  const [novoNumero, setNovoNumero] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [pendingToggles, setPendingToggles] = useState<Set<string>>(new Set())
  const [downloading, setDownloading] = useState<Set<string>>(new Set())

  function downloadQR(dataUrl: string, numero: string) {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `qr-mesa-${numero}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function handleDownloadQR(mesa: Mesa) {
    const id = mesa.id
    setDownloading((prev) => new Set(prev).add(id))
    try {
      let qrUrl = mesa.qr_code_url
      if (!qrUrl) {
        const atualizada = await regenMutation.mutateAsync({ restauranteId, id })
        qrUrl = atualizada.qr_code_url
      }
      if (qrUrl) downloadQR(qrUrl, mesa.numero)
    } catch {
      toast.error('Erro ao gerar QR Code')
    }
    setDownloading((prev) => { const next = new Set(prev); next.delete(id); return next })
  }

  async function handleAdicionar() {
    const numero = novoNumero.trim()
    if (!numero) {
      toast.error('Digite o número da mesa')
      return
    }
    try {
      await criarMutation.mutateAsync({ restauranteId, dto: { numero } })
      toast.success(`Mesa ${numero} adicionada`)
      setNovoNumero('')
    } catch (err) {
      const axiosError = err as { response?: { data?: { erro?: string } } } | undefined
      toast.error(axiosError?.response?.data?.erro || 'Erro ao adicionar mesa')
    }
  }

  async function handleToggleOcupada(mesaId: string, ocupada: boolean) {
    setPendingToggles((prev) => new Set(prev).add(mesaId))
    try {
      await atualizarMutation.mutateAsync({ restauranteId, id: mesaId, dto: { ocupada: !ocupada } })
    } catch {
      toast.error('Erro ao atualizar mesa')
    }
    setPendingToggles((prev) => { const next = new Set(prev); next.delete(mesaId); return next })
  }

  async function handleDeletar(mesaId: string) {
    try {
      await deletarMutation.mutateAsync({ restauranteId, id: mesaId })
      toast.success('Mesa removida')
    } catch {
      toast.error('Erro ao remover mesa')
    }
    setConfirmDelete(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="size-6 rounded-full border-2 border-laranja/20 border-t-laranja animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="border border-border/50 bg-card/60 backdrop-blur-md shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-laranja/10">
              <Smartphone className="size-4 text-laranja" />
            </div>
            <p className="text-sm text-muted-foreground">
              {mesas && mesas.length > 0
                ? `${mesas.length} mesa${mesas.length > 1 ? 's' : ''} cadastrada${mesas.length > 1 ? 's' : ''}`
                : 'Nenhuma mesa cadastrada'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Número da mesa (ex: 5)"
              value={novoNumero}
              onChange={(e) => setNovoNumero(e.target.value)}
              className="h-9 text-sm"
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdicionar() }}
            />
            <Button
              size="sm"
              onClick={handleAdicionar}
              disabled={criarMutation.isPending}
              className="shrink-0 h-9"
            >
              {criarMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {mesas && mesas.length > 0 && (
        <div className="space-y-2">
          {mesas.map((mesa) => (
            <Card
              key={mesa.id}
              className="border border-border/50 bg-card/40 backdrop-blur-md shadow-sm transition-all duration-200 hover:border-laranja/20"
            >
              <CardContent className="flex items-center justify-between gap-3 p-3.5 sm:p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-laranja/10">
                    <Smartphone className="size-4 text-laranja" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">Mesa {mesa.numero}</span>
                      {mesa.ocupada ? (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] text-destructive">
                          <XCircle className="size-2.5" />
                          Ocupada
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-verde/10 px-1.5 py-0.5 text-[10px] text-verde">
                          <CheckCircle2 className="size-2.5" />
                          Disponível
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                      <QrCode className="size-3" />
                      <code className="truncate max-w-[180px] sm:max-w-[300px]">
                        /cardapio/{slug}?mesa={mesa.numero}
                      </code>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-laranja"
                    onClick={() => handleDownloadQR(mesa)}
                    title="Baixar QR Code"
                  >
                    {downloading.has(mesa.id) ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Download className="size-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => handleToggleOcupada(mesa.id, mesa.ocupada)}
                    title={mesa.ocupada ? 'Marcar como disponível' : 'Marcar como ocupada'}
                  >
                    {pendingToggles.has(mesa.id) ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className={`size-3.5 ${mesa.ocupada ? 'text-destructive' : 'text-verde'}`} />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setConfirmDelete(mesa.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Remover mesa"
        message="Tem certeza que deseja remover esta mesa? Esta ação não pode ser desfeita."
        confirmLabel="Remover"
        variant="destructive"
        onConfirm={() => confirmDelete && handleDeletar(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
