import { Smartphone, ScanLine } from 'lucide-react'

export function NoMesaScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm text-center animate-fade-in">
        <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-laranja/20 to-laranja/5">
          <ScanLine className="size-12 text-laranja" />
        </div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          Escaneie o QR Code
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Aponte a câmera do seu celular para o QR Code impresso na mesa do restaurante para acessar o cardápio digital.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-4">
          <Smartphone className="size-6 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground/60">
            Cada mesa possui um QR Code único com o número da mesa.
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
