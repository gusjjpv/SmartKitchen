/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

interface MesaContextValue {
  mesa: number | null
}

const MesaContext = createContext<MesaContextValue>({ mesa: null })

export function MesaProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams()

  const value = useMemo(() => {
    const raw = searchParams.get('mesa')
    const mesa = raw ? Number(raw) : null
    return { mesa: mesa !== null && !Number.isNaN(mesa) ? mesa : null }
  }, [searchParams])

  return <MesaContext.Provider value={value}>{children}</MesaContext.Provider>
}

export function useMesa() {
  return useContext(MesaContext)
}
