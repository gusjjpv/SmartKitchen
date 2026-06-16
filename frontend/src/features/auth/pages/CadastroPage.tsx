import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Loader2, UserPlus, Store, Mail, Lock, User, Phone, ChevronRight, AlertCircle } from 'lucide-react'
import { formatarTelefone, validarTelefone, emailSchema, nomeSchema, telefoneSchema } from '@/lib/validators'

export function CadastroPage() {
  const navigate = useNavigate()
  const { cadastro } = useAuth()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [contato, setContato] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  function clearError(field: string) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
    if (generalError) setGeneralError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGeneralError('')
    setFieldErrors({})
    const errors: Record<string, string> = {}

    const nomeResult = nomeSchema.safeParse(nome.trim())
    if (!nomeResult.success) errors.nome = nomeResult.error.issues[0].message

    const emailResult = emailSchema.safeParse(email.trim())
    if (!emailResult.success) errors.email = emailResult.error.issues[0].message

    const telResult = telefoneSchema.safeParse(contato)
    if (!telResult.success) errors.contato = telResult.error.issues[0].message

    if (!senha) errors.senha = 'Senha é obrigatória'
    if (senha !== confirmarSenha) errors.confirmarSenha = 'Senhas não conferem'
    if (senha && senha.length < 6) errors.senha = 'Senha deve ter ao menos 6 caracteres'

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsLoading(true)
    try {
      await cadastro({ nome: nome.trim(), email: email.trim(), senha, contato: contato.trim() })
      navigate('/restaurantes')
    } catch {
      setGeneralError('Erro ao cadastrar. Verifique os dados e tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 from-background via-background to-muted/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-laranja/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-verde/10 via-transparent to-transparent pointer-events-none" />

      <div className="absolute top-20 left-10 size-64 rounded-full bg-laranja/10 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-20 right-10 size-96 rounded-full bg-verde/5 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <main className="relative z-10 flex w-full items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px] animate-fade-in">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-laranja to-laranja/80 shadow-lg shadow-laranja/25 ring-1 dark:ring-white/10 ring-black/5 animate-scale-in">
              <Store className="size-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-2xl font-bold text-transparent dark:from-white dark:via-white dark:to-zinc-300">
              Criar Conta
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Cadastre-se para gerenciar seu restaurante
            </p>
          </div>

          <Card className="border dark:border-zinc-800/60 border-border/60 bg-card/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-2xl dark:shadow-black/30 shadow-lg">
            <div className="h-1 w-full rounded-t-xl bg-gradient-to-r from-laranja to-verde" />
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-sm font-medium text-foreground/80 dark:text-zinc-300">Nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                    <Input
                      id="nome"
                      placeholder="Seu nome completo"
                      value={nome}
                      onChange={(e) => { setNome(e.target.value); clearError('nome') }}
                      autoFocus
                      aria-required="true"
                      aria-invalid={!!fieldErrors.nome}
                      aria-describedby={fieldErrors.nome ? 'nome-error' : undefined}
                      className={`h-11 border dark:border-zinc-800 border-border bg-background/50 dark:bg-zinc-950/50 pl-10 text-foreground placeholder:text-muted-foreground/50 focus:border-laranja/50 focus:ring-laranja/20 transition-all ${
                        fieldErrors.nome ? 'border-destructive/50 ring-destructive/20' : ''
                      }`}
                    />
                  </div>
                  {fieldErrors.nome && (
                    <p id="nome-error" role="alert" className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="size-3" />
                      {fieldErrors.nome}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground/80 dark:text-zinc-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearError('email') }}
                      aria-required="true"
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                      className={`h-11 border dark:border-zinc-800 border-border bg-background/50 dark:bg-zinc-950/50 pl-10 text-foreground placeholder:text-muted-foreground/50 focus:border-laranja/50 focus:ring-laranja/20 transition-all ${
                        fieldErrors.email ? 'border-destructive/50 ring-destructive/20' : ''
                      }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p id="email-error" role="alert" className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="size-3" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="senha" className="text-sm font-medium text-foreground/80 dark:text-zinc-300">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                      <Input
                        id="senha"
                        type="password"
                        placeholder="••••••••"
                        value={senha}
                        onChange={(e) => { setSenha(e.target.value); clearError('senha') }}
                        aria-required="true"
                        aria-invalid={!!fieldErrors.senha}
                        aria-describedby={fieldErrors.senha ? 'senha-error' : undefined}
                        className={`h-11 border dark:border-zinc-800 border-border bg-background/50 dark:bg-zinc-950/50 pl-10 text-foreground placeholder:text-muted-foreground/50 focus:border-laranja/50 focus:ring-laranja/20 transition-all ${
                          fieldErrors.senha ? 'border-destructive/50 ring-destructive/20' : ''
                        }`}
                      />
                    </div>
                    {fieldErrors.senha && (
                      <p id="senha-error" role="alert" className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="size-3" />
                        {fieldErrors.senha}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha" className="text-sm font-medium text-foreground/80 dark:text-zinc-300">Confirmar</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                      <Input
                        id="confirmarSenha"
                        type="password"
                        placeholder="••••••••"
                        value={confirmarSenha}
                        onChange={(e) => { setConfirmarSenha(e.target.value); clearError('confirmarSenha') }}
                        aria-invalid={!!fieldErrors.confirmarSenha}
                        aria-describedby={fieldErrors.confirmarSenha ? 'confirmarSenha-error' : undefined}
                        className={`h-11 border dark:border-zinc-800 border-border bg-background/50 dark:bg-zinc-950/50 pl-10 text-foreground placeholder:text-muted-foreground/50 focus:border-laranja/50 focus:ring-laranja/20 transition-all ${
                          fieldErrors.confirmarSenha ? 'border-destructive/50 ring-destructive/20' : ''
                        }`}
                      />
                    </div>
                    {fieldErrors.confirmarSenha && (
                      <p id="confirmarSenha-error" role="alert" className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="size-3" />
                        {fieldErrors.confirmarSenha}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contato" className="text-sm font-medium text-foreground/80 dark:text-zinc-300">WhatsApp</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                    <Input
                      id="contato"
                      placeholder="+55 (DD) XXXXX-XXXX"
                      value={formatarTelefone(contato)}
                      onChange={(e) => { setContato(e.target.value); clearError('contato') }}
                      aria-invalid={!!fieldErrors.contato}
                      aria-describedby={fieldErrors.contato ? 'contato-error' : undefined}
                      className={`h-11 border dark:border-zinc-800 border-border bg-background/50 dark:bg-zinc-950/50 pl-10 text-foreground placeholder:text-muted-foreground/50 focus:border-laranja/50 focus:ring-laranja/20 transition-all ${
                        fieldErrors.contato ? 'border-destructive/50 ring-destructive/20' : ''
                      }`}
                    />
                  </div>
                  {fieldErrors.contato && (
                    <p id="contato-error" role="alert" className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="size-3" />
                      {fieldErrors.contato}
                    </p>
                  )}
                </div>

                {generalError && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-xs text-destructive ring-1 ring-destructive/20" role="alert">
                    {generalError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="group relative h-11 w-full overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Cadastrar
                      <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-muted-foreground/70">
                Já tem conta?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-laranja/90 hover:text-laranja hover:underline transition-colors"
                >
                  Faça login
                </Link>
              </p>

              <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground/40">
                <span className="h-px flex-1 bg-border/50" />
                SmartKitchen Gestão
                <span className="h-px flex-1 bg-border/50" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
