import { useTheme } from '@/contexts/ThemeProvider'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ThemeToggleProps {
  variant?: 'icon' | 'full'
}

export function ThemeToggle({ variant = 'icon' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`${variant === 'full' ? 'w-full justify-start gap-3' : 'size-9 rounded-lg'} text-muted-foreground hover:text-foreground hover:bg-accent transition-colors`}
      aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
      title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
    >
      {theme === 'dark' ? (
        <Sun className="size-4 animate-rotate-in" />
      ) : (
        <Moon className="size-4 animate-rotate-in" />
      )}
      {variant === 'full' && (
        <span className="text-sm">{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
      )}
    </Button>
  )
}
