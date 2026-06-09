import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, LogIn, Mail, Lock, Store, ChevronRight } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !senha.trim()) {
      setError('Preencha todos os campos')
      return
    }

    setIsLoading(true)
    try {
      await login({ email: email.trim(), senha })
      navigate('/restaurantes')
    } catch {
      setError('Email ou senha inválidos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-laranja/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-verde/10 via-transparent to-transparent pointer-events-none" />

      <div className="absolute top-20 left-10 size-64 rounded-full bg-laranja/10 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-20 right-10 size-96 rounded-full bg-verde/5 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <main className="relative z-10 flex w-full items-center justify-center px-4">
        <div className="w-full max-w-[420px] animate-fade-in">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-laranja to-laranja/80 shadow-lg shadow-laranja/25 ring-1 ring-white/10 animate-scale-in">
              <Store className="size-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-white via-white to-zinc-300 bg-clip-text text-2xl font-bold text-transparent">
              SmartKitchen
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Faça login para gerenciar seu restaurante
            </p>
          </div>

          <Card className="border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl shadow-2xl shadow-black/30">
            <div className="h-1 w-full rounded-t-xl bg-gradient-to-r from-laranja to-verde" />
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-zinc-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                      aria-required="true"
                      className="h-11 border-zinc-800 bg-zinc-950/50 pl-10 text-zinc-100 placeholder:text-zinc-600 focus:border-laranja/50 focus:ring-laranja/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha" className="text-sm font-medium text-zinc-300">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <Input
                      id="senha"
                      type="password"
                      placeholder="••••••••"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      aria-required="true"
                      className="h-11 border-zinc-800 bg-zinc-950/50 pl-10 text-zinc-100 placeholder:text-zinc-600 focus:border-laranja/50 focus:ring-laranja/20 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-xs text-destructive ring-1 ring-destructive/20" role="alert">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="group relative h-11 w-full overflow-hidden rounded-xl bg-gradient-to-r from-laranja to-laranja/80 text-sm font-bold text-white shadow-lg shadow-laranja/25 transition-all duration-300 hover:shadow-xl hover:shadow-laranja/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Entrar
                      <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-zinc-500">
                Não tem conta?{' '}
                <Link
                  to="/cadastro"
                  className="font-semibold text-laranja/90 hover:text-laranja hover:underline transition-colors"
                >
                  Cadastre-se
                </Link>
              </p>

              <div className="mt-4 flex items-center gap-2 text-[10px] text-zinc-600/50">
                <span className="h-px flex-1 bg-zinc-800/50" />
                SmartKitchen Gestão
                <span className="h-px flex-1 bg-zinc-800/50" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
