import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, LogIn, Store } from 'lucide-react'
import { toast } from 'sonner'

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
      toast.success('Login realizado com sucesso!')
      navigate('/restaurantes')
    } catch {
      setError('Email ou senha inválidos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 animate-fade-in">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-laranja/15 via-laranja/5 to-background pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-verde/10 via-transparent to-background pointer-events-none" />

      <div className="relative w-full max-w-sm animate-slide-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-laranja to-laranja/70 shadow-lg shadow-laranja/20">
            <Store className="size-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">SmartKitchen</h1>
          <p className="mt-1 text-sm text-muted-foreground">Faça login para continuar</p>
        </div>

        <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  aria-required="true"
                />
              </div>

              {error && (
                <p className="text-center text-xs text-destructive" role="alert">{error}</p>
              )}

              <Button type="submit" className="w-full shadow-lg shadow-laranja/20 hover:shadow-xl hover:shadow-laranja/30 transition-all" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LogIn className="size-4" />
                )}
                Entrar
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Não tem conta?{' '}
              <Link to="/cadastro" className="font-medium text-laranja hover:text-laranja/80 hover:underline transition-colors">
                Cadastre-se
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
