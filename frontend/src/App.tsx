import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/restaurantes" replace />} />
          <Route path="/restaurantes" element={<RestauranteListPage />} />
          <Route path="/admin" element={<AdminRestaurantePage />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}

export default App
