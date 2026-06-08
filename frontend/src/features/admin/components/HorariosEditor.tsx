import { useListarHorarios, useCriarHorario, useAtualizarHorario } from '@/hooks/useHorarios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { DIAS_SEMANA, type HorarioFuncionamento } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { Loader2, Save, Clock } from 'lucide-react'

interface HorariosEditorProps {
  restauranteId: string
}

interface DiaHorarioState {
  dia_semana: number
  horario_abertura: string
  horario_fechamento: string
  fechado: boolean
}

function buildInitialState(horarios: HorarioFuncionamento[] | undefined): DiaHorarioState[] {
  return DIAS_SEMANA.map((_, idx) => {
    const existing = horarios?.find((h) => h.dia_semana === idx)
    return {
      dia_semana: idx,
      horario_abertura: existing?.horario_abertura ?? '',
      horario_fechamento: existing?.horario_fechamento ?? '',
      fechado: existing?.fechado ?? false,
    }
  })
}

export function HorariosEditor({ restauranteId }: HorariosEditorProps) {
  const { data: horarios, isLoading } = useListarHorarios(restauranteId)
  const criarMutation = useCriarHorario()
  const atualizarMutation = useAtualizarHorario()

  const [dias, setDias] = useState<DiaHorarioState[]>(() => buildInitialState(horarios))
  const [initialized, setInitialized] = useState(false)

  if (horarios && !initialized) {
    setDias(buildInitialState(horarios))
    setInitialized(true)
  }

  const [savingDia, setSavingDia] = useState<number | null>(null)

  function updateDia(dia_semana: number, partial: Partial<DiaHorarioState>) {
    setDias((prev) => prev.map((d) => (d.dia_semana === dia_semana ? { ...d, ...partial } : d)))
  }

  async function salvarDia(dia: DiaHorarioState) {
    setSavingDia(dia.dia_semana)
    try {
      const existing = horarios?.find((h) => h.dia_semana === dia.dia_semana)

      if (existing) {
        await atualizarMutation.mutateAsync({
          restauranteId,
          diaSemana: dia.dia_semana,
          dto: {
            horario_abertura: dia.fechado ? undefined : dia.horario_abertura || undefined,
            horario_fechamento: dia.fechado ? undefined : dia.horario_fechamento || undefined,
            fechado: dia.fechado,
          },
        })
      } else {
        await criarMutation.mutateAsync({
          restaurante_id: restauranteId,
          dia_semana: dia.dia_semana,
          horario_abertura: dia.fechado ? undefined : dia.horario_abertura || undefined,
          horario_fechamento: dia.fechado ? undefined : dia.horario_fechamento || undefined,
          fechado: dia.fechado,
        })
      }
    } finally {
      setSavingDia(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="size-6 rounded-full border-2 border-laranja/20 border-t-laranja animate-spin" />
      </div>
    )
  }

  const hasAnyData = dias.some((d) => d.horario_abertura || d.fechado)

  return (
    <div className="space-y-3">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-verde/10">
          <Clock className="size-4 text-verde" />
        </div>
        <p className="text-sm text-muted-foreground">
          {hasAnyData
            ? 'Ajuste os horários de cada dia e salve individualmente'
            : 'Defina os horários de funcionamento para cada dia da semana'}
        </p>
      </div>

      {dias.map((dia) => {
        const isSaving = savingDia === dia.dia_semana
        const isChanged = dia.fechado !== (horarios?.find((h) => h.dia_semana === dia.dia_semana)?.fechado ?? false)
          || dia.horario_abertura !== (horarios?.find((h) => h.dia_semana === dia.dia_semana)?.horario_abertura ?? '')
          || dia.horario_fechamento !== (horarios?.find((h) => h.dia_semana === dia.dia_semana)?.horario_fechamento ?? '')

        return (
          <Card key={dia.dia_semana} className="border border-border/50 bg-card/60 backdrop-blur-md shadow-sm transition-all duration-200 hover:border-border/80">
            <CardContent className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-5">
              <div className="flex min-w-[8rem] items-center gap-2.5">
                <div className={`size-2.5 rounded-full ${dia.fechado ? 'bg-destructive' : 'bg-verde'}`} />
                <span className="text-sm font-medium text-foreground">{DIAS_SEMANA[dia.dia_semana]}</span>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id={`fechado-${dia.dia_semana}`}
                  checked={dia.fechado}
                  onCheckedChange={(checked) =>
                    updateDia(dia.dia_semana, { fechado: checked === true })
                  }
                  className="data-[state=checked]:bg-verde data-[state=checked]:border-verde"
                />
                <Label htmlFor={`fechado-${dia.dia_semana}`} className="text-sm text-muted-foreground">
                  Fechado
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={dia.horario_abertura}
                  onChange={(e) => updateDia(dia.dia_semana, { horario_abertura: e.target.value })}
                  disabled={dia.fechado}
                  className="w-28 sm:w-32 h-8 text-xs"
                />
                <span className="text-muted-foreground text-xs">até</span>
                <Input
                  type="time"
                  value={dia.horario_fechamento}
                  onChange={(e) => updateDia(dia.dia_semana, { horario_fechamento: e.target.value })}
                  disabled={dia.fechado}
                  className="w-28 sm:w-32 h-8 text-xs"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => salvarDia(dia)}
                disabled={isSaving || !isChanged}
                className="ml-auto w-full sm:w-auto h-8 text-xs"
              >
                {isSaving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
