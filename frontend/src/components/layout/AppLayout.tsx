import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LogOut, Store, X, Menu, LayoutDashboard } from 'lucide-react'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/ThemeToggle'

function AppHeader() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    toast.success('Sessão encerrada')
    navigate('/login')
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/restaurantes')}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-laranja to-laranja/80 shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Store className="size-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground leading-tight tracking-tight">SmartKitchen</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Gestão de Restaurantes</span>
            </div>
          </button>

          {user && (
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-3 sm:flex">
                <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-laranja to-laranja/70 text-xs font-bold text-white shadow-sm">
                  {user.nome.charAt(0).toUpperCase()}
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-foreground leading-tight">{user.nome}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{user.email}</p>
                </div>
                <ThemeToggle />
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" onClick={handleLogout}>
                  <LogOut className="size-3.5" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="flex sm:hidden size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Abrir menu"
              >
                <Menu className="size-5" />
              </Button>
            </div>
          )}
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col sm:hidden animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative ml-auto flex h-full w-72 max-w-[85vw] flex-col bg-card border-l border-border/50 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-laranja to-laranja/80">
                  <Store className="size-4 text-white" />
                </div>
                <span className="text-sm font-bold text-foreground">SmartKitchen</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Fechar menu"
              >
                <X className="size-5" />
              </button>
            </div>

            {user && (
              <div className="border-b border-border/50 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-laranja to-laranja/70 text-sm font-bold text-white shadow-sm">
                    {user.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.nome}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 px-2 py-3">
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => { navigate('/restaurantes'); setMobileMenuOpen(false) }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  <LayoutDashboard className="size-4 text-laranja" />
                  Restaurantes
                </button>
              </nav>
            </div>

            <div className="border-t border-border/50 px-2 py-3 space-y-1">
              <ThemeToggle variant="full" />
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-laranja/5 via-background to-background pointer-events-none" />
      <AppHeader />
      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
        {children}
      </main>
    </div>
  )
}
