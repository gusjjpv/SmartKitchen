import { useState } from 'react'
import { Input } from './input'

function formatBRL(value: string) {
  const num = parseFloat(value)
  if (isNaN(num)) return ''
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

interface CurrencyInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function CurrencyInput({ value, onChange, className, placeholder, ...props }: CurrencyInputProps) {
  const [focused, setFocused] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d.,]/g, '')
    const normalized = raw
      .replace(/,/g, '.')
      .replace(/(\..*)\./g, '$1')
    onChange(normalized)
  }

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
        R$
      </span>
      <Input
        value={focused ? value : formatBRL(value)}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`pl-9 ${className ?? ''}`}
        {...props}
      />
    </div>
  )
}
