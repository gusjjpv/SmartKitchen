import { useState } from 'react'
import { ScanLine, Smartphone, Loader2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatarCpf, validarDigitosCPF } from '@/lib/validators'

interface CpfInputScreenProps {
  onConfirm: (cpf: string) => Promise<void>
}

export function CpfInputScreen({ onConfirm }: CpfInputScreenProps) {
  const [raw, setRaw] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const digits = raw.replace(/\D/g, '').slice(0, 11)
  const digitosCompletos = digits.length === 11
  const cpfValido = digitosCompletos && validarDigitosCPF(digits)

  async function handleSubmit() {
    if (loading) return
    setError('')

    if (!digitosCompletos) {
      setError('Digite o CPF completo')
      return
    }

    if (!cpfValido) {
      setError('CPF inválido')
      return
    }

    setLoading(true)
    try {
      await onConfirm(digits)
    } catch {
      setError('Erro ao confirmar CPF')
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
          <div>
            <Input
              value={formatarCpf(raw)}
              onChange={(e) => {
                setRaw(e.target.value)
                if (error) setError('')
              }}
              placeholder="000.000.000-00"
              maxLength={14}
              inputMode="numeric"
              autoFocus
              className={`text-center text-lg font-bold tracking-widest ${
                error ? 'border-destructive/50 ring-destructive/20' : ''
              }`}
              aria-invalid={!!error}
              aria-describedby={error ? 'cpf-error' : undefined}
            />
            {error && (
              <p id="cpf-error" role="alert" className="mt-1.5 flex items-center justify-center gap-1 text-xs text-destructive">
                <AlertCircle className="size-3" />
                {error}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={!digitosCompletos || loading}
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
