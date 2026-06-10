import { useState } from 'react'
import { useListarCategorias, useCriarCategoria, useAtualizarCategoria, useDeletarCategoria, useListarProdutos, useCriarProduto, useAtualizarProduto, useDeletarProduto } from '@/hooks/useCardapio'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Plus, Pencil, Trash2, X, Check, ImageIcon, Tag, Package } from 'lucide-react'
import { toast } from 'sonner'
import type { Categoria, Produto } from '@/types'
import { ConfirmDialog } from '@/components/ConfirmDialog'

interface CardapioEditorProps {
  restauranteId: string
}

function formatarPreco(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const lerBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

function CategoriaRow({
  categoria,
  editando,
  onEditar,
  onSalvar,
  onCancelar,
  onExcluir,
  selecionada,
  onSelecionar,
}: {
  categoria: Categoria
  editando: boolean
  onEditar: () => void
  onSalvar: (nome: string, ordem: number) => Promise<void>
  onCancelar: () => void
  onExcluir: () => void
  selecionada: boolean
  onSelecionar: () => void
}) {
  const [nome, setNome] = useState(categoria.nome)
  const [ordem, setOrdem] = useState(String(categoria.ordem))
  const [saving, setSaving] = useState(false)

  if (editando) {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg border p-2.5 transition-colors ${
          selecionada ? 'border-laranja/50 bg-laranja/5' : 'border-border/50 bg-muted/20'
        }`}
      >
        <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" className="h-8 text-xs" />
        <Input value={ordem} onChange={(e) => setOrdem(e.target.value)} type="number" placeholder="Ordem" className="h-8 w-16 text-xs" />
        <Button size="icon" variant="ghost" className="size-7" disabled={saving} onClick={async () => { setSaving(true); await onSalvar(nome, Number(ordem)); setSaving(false) }} aria-label="Salvar categoria">
          {saving ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3 text-verde" />}
        </Button>
        <Button size="icon" variant="ghost" className="size-7" onClick={onCancelar} aria-label="Cancelar edição">
          <X className="size-3" />
        </Button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onSelecionar}
      className={`flex w-full items-center gap-2 rounded-lg border p-2.5 text-left text-xs transition-all duration-200 hover:bg-muted/30 ${
        selecionada
          ? 'border-laranja/50 bg-laranja/5 shadow-sm shadow-laranja/5'
          : 'border-border/50 bg-card/30 hover:border-border'
      }`}
    >
      <Tag className={`size-3.5 shrink-0 ${categoria.ativo ? 'text-laranja' : 'text-muted-foreground/40'}`} />
      <span className="flex-1 truncate font-medium text-foreground">{categoria.nome}</span>
      <span className="text-muted-foreground/60">({categoria._count?.produtos ?? 0})</span>
      {!categoria.ativo && (
        <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] text-destructive">Inativo</span>
      )}
      <button type="button" onClick={(e) => { e.stopPropagation(); onEditar() }} className="p-1 text-muted-foreground hover:text-foreground transition-colors" aria-label={`Editar ${categoria.nome}`}>
        <Pencil className="size-3" />
      </button>
      <button type="button" onClick={(e) => { e.stopPropagation(); onExcluir() }} className="p-1 text-muted-foreground hover:text-destructive transition-colors" aria-label={`Excluir ${categoria.nome}`}>
        <Trash2 className="size-3" />
      </button>
    </button>
  )
}

function ProdutoCard({
  produto,
  onEditar,
  onExcluir,
}: {
  produto: Produto
  onEditar: () => void
  onExcluir: () => void
}) {
  return (
    <Card className="group border border-border/50 bg-card/60 backdrop-blur-md shadow-md transition-all duration-300 hover:border-laranja/20 hover:shadow-xl hover:shadow-laranja/5 hover:-translate-y-0.5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {produto.foto_base64 ? (
            <img src={produto.foto_base64} alt={produto.nome} className="size-14 shrink-0 rounded-lg border border-border/50 object-cover shadow-sm" />
          ) : (
            <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border/50 bg-muted/20">
              <ImageIcon className="size-5 text-muted-foreground/30" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-1">
              <h4 className="text-sm font-semibold text-foreground truncate">{produto.nome}</h4>
              <span
                className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                  produto.disponivel
                    ? 'bg-verde/10 text-verde'
                    : 'bg-destructive/10 text-destructive'
                }`}
              >
                {produto.disponivel ? 'Disponível' : 'Indisponível'}
              </span>
            </div>
            {produto.descricao && (
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground/70">{produto.descricao}</p>
            )}
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-sm font-bold text-laranja">{formatarPreco(produto.preco)}</span>
              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="size-7" onClick={onEditar} aria-label={`Editar ${produto.nome}`}>
                  <Pencil className="size-3" />
                </Button>
                <Button size="icon" variant="ghost" className="size-7 text-muted-foreground hover:text-destructive" onClick={onExcluir} aria-label={`Excluir ${produto.nome}`}>
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProdutoForm({
  categorias,
  onSalvar,
  onCancelar,
  initial,
}: {
  categorias: Categoria[]
  onSalvar: (dto: { categoria_id: string; nome: string; descricao?: string; preco: number; foto_base64?: string; disponivel?: boolean }) => Promise<void>
  onCancelar: () => void
  initial?: Produto
}) {
  const [categoriaId, setCategoriaId] = useState(initial?.categoria_id ?? categorias[0]?.id ?? '')
  const [nome, setNome] = useState(initial?.nome ?? '')
  const [descricao, setDescricao] = useState(initial?.descricao ?? '')
  const [preco, setPreco] = useState(initial ? String(initial.preco) : '')
  const [fotoBase64, setFotoBase64] = useState<string | null>(initial?.foto_base64 ?? null)
  const [disponivel, setDisponivel] = useState(initial?.disponivel ?? true)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!categoriaId || !nome.trim() || !preco) {
      toast.error('Preencha os campos obrigatórios')
      return
    }
    setSaving(true)
    try {
      await onSalvar({
        categoria_id: categoriaId,
        nome: nome.trim(),
        descricao: descricao || undefined,
        preco: Number(preco),
        foto_base64: fotoBase64 ?? undefined,
        disponivel,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-2 border-dashed border-laranja/20 bg-laranja/[0.02]">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Categoria *</Label>
              <Select value={categoriaId} onValueChange={setCategoriaId}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {categorias.filter(c => c.ativo).map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Nome *</Label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Coca-Cola" className="h-8 text-xs" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-xs text-muted-foreground">Descrição</Label>
              <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={2} placeholder="Descrição do produto" className="text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Preço *</Label>
              <CurrencyInput value={preco} onChange={setPreco} placeholder="0,00" className="h-8 text-xs" />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground">Foto</Label>
                <Input
                  type="file"
                  accept="image/*"
                  className="h-8 text-xs file:h-6"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) setFotoBase64(await lerBase64(file))
                  }}
                />
              </div>
              {fotoBase64 && (
                <Button type="button" variant="ghost" size="icon" className="mb-0.5 size-8" onClick={() => setFotoBase64(null)} aria-label="Remover foto">
                  <X className="size-3" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="disponivel" checked={disponivel} onCheckedChange={(v) => setDisponivel(v === true)} />
              <Label htmlFor="disponivel" className="text-xs text-muted-foreground">Disponível</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={onCancelar}>Cancelar</Button>
            <Button type="submit" size="sm" className="h-7 text-xs" disabled={saving}>
              {saving ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
              {initial ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function CardapioEditor({ restauranteId }: CardapioEditorProps) {
  const { data: categorias, isLoading: loadingCategorias } = useListarCategorias(restauranteId)
  const criarCategoria = useCriarCategoria()
  const atualizarCategoria = useAtualizarCategoria()
  const deletarCategoria = useDeletarCategoria()
  const [categoriaEditandoId, setCategoriaEditandoId] = useState<string | null>(null)
  const [mostrarNovaCategoria, setMostrarNovaCategoria] = useState(false)
  const [novaCatNome, setNovaCatNome] = useState('')
  const [novaCatOrdem, setNovaCatOrdem] = useState('0')

  const [categoriaSelecionadaId, setCategoriaSelecionadaId] = useState<string | null>(null)

  const { data: produtos, isLoading: loadingProdutos } = useListarProdutos(restauranteId, categoriaSelecionadaId)

  const criarProduto = useCriarProduto()
  const atualizarProduto = useAtualizarProduto()
  const deletarProduto = useDeletarProduto()
  const [mostrarFormProduto, setMostrarFormProduto] = useState(false)
  const [produtoEditandoId, setProdutoEditandoId] = useState<string | null>(null)

  const [confirmDelete, setConfirmDelete] = useState<{ type: 'categoria' | 'produto'; id: string } | null>(null)

  if (loadingCategorias) {
    return (
      <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
        <div className="size-6 rounded-full border-2 border-laranja/20 border-t-laranja animate-spin" />
      </div>
    )
  }

  const categoriaSelecionada = categorias?.find(c => c.id === categoriaSelecionadaId)
  const produtoEditando = produtoEditandoId ? produtos?.find(p => p.id === produtoEditandoId) : undefined

  async function handleCriarCategoria() {
    if (!novaCatNome.trim()) return
    try {
      await criarCategoria.mutateAsync({ restauranteId, dto: { nome: novaCatNome.trim(), ordem: Number(novaCatOrdem) } })
      setNovaCatNome('')
      setNovaCatOrdem('0')
      setMostrarNovaCategoria(false)
      toast.success('Categoria criada')
    } catch { toast.error('Erro ao criar categoria') }
  }

  async function handleAtualizarCategoria(id: string, nome: string, ordem: number) {
    try {
      await atualizarCategoria.mutateAsync({ restauranteId, id, dto: { nome, ordem } })
      setCategoriaEditandoId(null)
      toast.success('Categoria atualizada')
    } catch { toast.error('Erro ao atualizar categoria') }
  }

  async function handleDeletarCategoria(id: string) {
    try {
      await deletarCategoria.mutateAsync({ restauranteId, id })
      if (categoriaSelecionadaId === id) setCategoriaSelecionadaId(null)
      toast.success('Categoria excluída')
      setConfirmDelete(null)
    } catch { toast.error('Erro ao excluir categoria'); setConfirmDelete(null) }
  }

  async function handleCriarProduto(dto: { categoria_id: string; nome: string; descricao?: string; preco: number; foto_base64?: string; disponivel?: boolean }) {
    try {
      await criarProduto.mutateAsync({ restauranteId, dto })
      setMostrarFormProduto(false)
      toast.success('Produto adicionado')
    } catch { toast.error('Erro ao adicionar produto') }
  }

  async function handleAtualizarProduto(dto: { categoria_id: string; nome: string; descricao?: string; preco: number; foto_base64?: string; disponivel?: boolean }) {
    if (!produtoEditandoId) return
    try {
      await atualizarProduto.mutateAsync({ restauranteId, id: produtoEditandoId, dto })
      setProdutoEditandoId(null)
      toast.success('Produto atualizado')
    } catch { toast.error('Erro ao atualizar produto') }
  }

  async function handleDeletarProduto(id: string) {
    try {
      await deletarProduto.mutateAsync({ restauranteId, id })
      toast.success('Produto excluído')
      setConfirmDelete(null)
    } catch { toast.error('Erro ao excluir produto'); setConfirmDelete(null) }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Tag className="size-4 text-laranja" />
            Categorias
          </h3>
          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={() => setMostrarNovaCategoria(!mostrarNovaCategoria)}>
            <Plus className="size-3" />
            Nova Categoria
          </Button>
        </div>

        {mostrarNovaCategoria && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-dashed border-laranja/20 bg-laranja/[0.02] p-2.5">
            <Input value={novaCatNome} onChange={(e) => setNovaCatNome(e.target.value)} placeholder="Nome da categoria" className="h-8 text-xs" autoFocus />
            <Input value={novaCatOrdem} onChange={(e) => setNovaCatOrdem(e.target.value)} type="number" placeholder="Ordem" className="h-8 w-16 text-xs" />
            <Button size="icon" variant="ghost" className="size-7" onClick={handleCriarCategoria} disabled={criarCategoria.isPending} aria-label="Criar categoria">
              {criarCategoria.isPending ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3 text-verde" />}
            </Button>
            <Button size="icon" variant="ghost" className="size-7" onClick={() => setMostrarNovaCategoria(false)} aria-label="Cancelar">
              <X className="size-3" />
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {(categorias ?? []).length === 0 && (
            <p className="w-full py-8 text-center text-xs text-muted-foreground">
              Nenhuma categoria cadastrada.
            </p>
          )}
          {(categorias ?? []).map((cat) => (
            <CategoriaRow
              key={cat.id}
              categoria={cat}
              editando={categoriaEditandoId === cat.id}
              onEditar={() => { setCategoriaEditandoId(cat.id); setMostrarNovaCategoria(false) }}
              onSalvar={async (nome, ordem) => { await handleAtualizarCategoria(cat.id, nome, ordem) }}
              onCancelar={() => setCategoriaEditandoId(null)}
              onExcluir={() => setConfirmDelete({ type: 'categoria', id: cat.id })}
              selecionada={categoriaSelecionadaId === cat.id}
              onSelecionar={() => setCategoriaSelecionadaId(cat.id === categoriaSelecionadaId ? null : cat.id)}
            />
          ))}
        </div>
      </div>

      {categoriaSelecionadaId && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Package className="size-4 text-laranja" />
              Produtos — {categoriaSelecionada?.nome ?? ''}
            </h3>
            {!mostrarFormProduto && !produtoEditandoId && (
              <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={() => setMostrarFormProduto(true)}>
                <Plus className="size-3" />
                Novo Produto
              </Button>
            )}
          </div>

          {(mostrarFormProduto || produtoEditandoId) && (
            <div className="mb-4">
              <ProdutoForm
                categorias={categorias ?? []}
                initial={produtoEditando}
                onSalvar={produtoEditandoId ? handleAtualizarProduto : handleCriarProduto}
                onCancelar={() => { setMostrarFormProduto(false); setProdutoEditandoId(null) }}
              />
            </div>
          )}

          {loadingProdutos ? (
            <div className="flex items-center justify-center py-8" role="status" aria-live="polite">
              <div className="size-5 rounded-full border-2 border-laranja/20 border-t-laranja animate-spin" />
            </div>
          ) : (produtos ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-muted/10 py-10">
              <Package className="mb-2 size-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">Nenhum produto nesta categoria</p>
              <Button variant="outline" size="sm" className="mt-3 h-7 gap-1 text-xs" onClick={() => setMostrarFormProduto(true)}>
                <Plus className="size-3" />
                Adicionar Produto
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {(produtos ?? []).map((prod) => (
                <ProdutoCard
                  key={prod.id}
                  produto={prod}
                  onEditar={() => { setProdutoEditandoId(prod.id); setMostrarFormProduto(false) }}
                  onExcluir={() => setConfirmDelete({ type: 'produto', id: prod.id })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!categoriaSelecionadaId && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-muted/10 py-10">
          <Tag className="mb-2 size-8 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground">Selecione uma categoria para ver os produtos</p>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete !== null}
        title={confirmDelete?.type === 'categoria' ? 'Excluir categoria?' : 'Excluir produto?'}
        message={
          confirmDelete?.type === 'categoria'
            ? 'Os produtos desta categoria serão removidos permanentemente.'
            : 'Esta ação não pode ser desfeita.'
        }
        confirmLabel="Excluir"
        variant="destructive"
        loading={deletarCategoria.isPending || deletarProduto.isPending}
        onConfirm={() => {
          if (!confirmDelete) return
          if (confirmDelete.type === 'categoria') handleDeletarCategoria(confirmDelete.id)
          else handleDeletarProduto(confirmDelete.id)
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
