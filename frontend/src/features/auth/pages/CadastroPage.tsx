import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, UserPlus, Store } from 'lucide-react'

export function CadastroPage() {
  const navigate = useNavigate()
  const { cadastro } = useAuth()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [contato, setContato] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!nome.trim() || !email.trim() || !senha.trim() || !contato.trim()) {
      setError('Preencha todos os campos')
      return
    }

    if (senha !== confirmarSenha) {
      setError('Senhas não conferem')
      return
    }

    setIsLoading(true)
    try {
      await cadastro({ nome: nome.trim(), email: email.trim(), senha, contato: contato.trim() })
      navigate('/restaurantes')
    } catch {
      setError('Erro ao cadastrar. Verifique os dados e tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-laranja/15 via-laranja/5 to-background pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-verde/10 via-transparent to-background pointer-events-none" />

      <div className="relative w-full max-w-sm animate-slide-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-laranja to-laranja/70 shadow-lg shadow-laranja/20">
            <Store className="size-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Criar Conta</h1>
          <p className="mt-1 text-sm text-muted-foreground">Cadastre-se para começar</p>
        </div>

        <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  placeholder="••••••••"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contato">Contato (WhatsApp)</Label>
                <Input
                  id="contato"
                  placeholder="5511999999999"
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-center text-xs text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full shadow-lg shadow-laranja/20 hover:shadow-xl hover:shadow-laranja/30 transition-all" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <UserPlus className="size-4" />
                )}
                Cadastrar
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Já tem conta?{' '}
              <Link to="/login" className="font-medium text-laranja hover:text-laranja/80 hover:underline transition-colors">
                Faça login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
