import { useState } from 'react'
import { ScanLine, Smartphone } from 'lucide-react'

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

        <div className="mt-8">
          <input
            value={formatarCpf(raw)}
            onChange={(e) => setRaw(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
            placeholder="000.000.000-00"
            maxLength={14}
            inputMode="numeric"
            autoFocus
            className="w-full rounded-xl border border-border/50 bg-card/60 px-4 py-3 text-center text-lg font-bold text-foreground tracking-widest placeholder:text-muted-foreground/30 focus:border-laranja/50 focus:outline-none focus:ring-2 focus:ring-laranja/20 transition-all"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!valido || loading}
          className="mt-4 w-full rounded-xl bg-laranja px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-laranja/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Entrando...
            </span>
          ) : (
            'Confirmar'
          )}
        </button>

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
