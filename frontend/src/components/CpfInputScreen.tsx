import { useState } from 'react'
import { ScanLine, Smartphone, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface CpfInputScreenProps {
  onConfirm: (cpf: string) => Promise<void>
}

function formatarCpf(valor: string) {
  const digits = valor.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function CpfInputScreen({ onConfirm }: CpfInputScreenProps) {
  const [raw, setRaw] = useState('')
  const [loading, setLoading] = useState(false)

  const digits = raw.replace(/\D/g, '').slice(0, 11)
  const valido = digits.length === 11

  async function handleSubmit() {
    if (!valido || loading) return
    setLoading(true)
    try {
      await onConfirm(digits)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm text-center animate-fade-in">
        <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-laranja/20 to-laranja/5">
          <ScanLine className="size-12 text-laranja" />
        </div>

        <h1 className="text-xl font-bold text-foreground tracking-tight">
          Identifique-se
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Digite seu CPF para iniciar o pedido nesta mesa
        </p>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="mt-8 space-y-4">
          <Input
            value={formatarCpf(raw)}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="000.000.000-00"
            maxLength={14}
            inputMode="numeric"
            autoFocus
            className="text-center text-lg font-bold tracking-widest"
          />
          <Button
            type="submit"
            disabled={!valido || loading}
            className="w-full"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Entrando...
              </span>
            ) : (
              'Confirmar'
            )}
          </Button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-4">
          <Smartphone className="size-6 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground/60">
            Seu CPF será usado apenas para identificar seu pedido nesta mesa
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground/40">
          <span className="h-px w-8 bg-border/50" />
          SmartKitchen
          <span className="h-px w-8 bg-border/50" />
        </div>
      </div>
    </div>
  )
}
