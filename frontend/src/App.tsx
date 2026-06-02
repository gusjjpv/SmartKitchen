import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ThemeProvider, useTheme } from '@/contexts/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthProvider'
import { AuthGuard } from '@/components/AuthGuard'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { CadastroPage } from '@/features/auth/pages/CadastroPage'
import { AdminRestaurantePage } from '@/features/admin/pages/AdminRestaurantePage'
import { RestauranteListPage } from '@/features/admin/pages/RestauranteListPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function ToasterWithTheme() {
  const { theme } = useTheme()
  return <Toaster richColors position="top-right" theme={theme} />
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<CadastroPage />} />
              <Route path="/" element={<Navigate to="/restaurantes" replace />} />
              <Route path="/restaurantes" element={<AuthGuard><RestauranteListPage /></AuthGuard>} />
              <Route path="/admin" element={<AuthGuard><AdminRestaurantePage /></AuthGuard>} />
            </Routes>
          </BrowserRouter>
          <ToasterWithTheme />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
