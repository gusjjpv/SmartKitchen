import { useParams, useNavigate } from 'react-router-dom'
import { useMesa } from '@/contexts/MesaContext'
import { MesaBadge } from '@/components/MesaBadge'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

export function PedidoConfirmadoPage() {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const { mesa } = useMesa()

  return (
    <div className="min-h-screen bg-background">
      <MesaBadge />

      <div className="flex flex-col items-center justify-center px-4 py-24">
        <div className="flex size-20 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="size-10 text-green-500" />
        </div>

        <h1 className="mt-6 text-xl font-bold text-foreground">Pedido enviado!</h1>
        <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">
          Seu pedido foi enviado para a cozinha{mesa && <> da Mesa {mesa}</>}.
          Em breve ele será preparado.
        </p>

        <button
          onClick={() => navigate(`/cardapio/${slug}?mesa=${mesa}`)}
          className="mt-8 flex items-center gap-2 rounded-xl bg-laranja px-6 py-3 text-sm font-bold text-white shadow-lg shadow-laranja/20 transition-all duration-200 hover:bg-laranja/90 active:scale-[0.98]"
        >
          <ArrowLeft className="size-4" />
          Fazer novo pedido
        </button>
      </div>
    </div>
  )
}
