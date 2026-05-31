import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageIcon, LinkIcon, Upload, X } from 'lucide-react'

interface LogoUploadProps {
  value?: string | null
  onChange: (base64: string | null) => void
}

export function LogoUpload({ value, onChange }: LogoUploadProps) {
  const [mode, setMode] = useState<'upload' | 'url' | null>(
    value ? (value.startsWith('data:') ? 'upload' : 'url') : null,
  )
  const [urlInput, setUrlInput] = useState(
    value && !value.startsWith('data:') ? value : '',
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      onChange(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  function handleUrlConfirm() {
    onChange(urlInput || null)
  }

  function handleRemove() {
    onChange(null)
    setUrlInput('')
    setMode(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      <Label>Logo do Restaurante</Label>

      {value ? (
        <div className="relative inline-block group">
          <img
            src={value}
            alt="Logo"
            className="h-28 w-28 rounded-xl border-2 border-areia object-cover shadow-sm transition-shadow group-hover:shadow-md"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute -top-2 -right-2 size-6 rounded-full shadow-sm opacity-80 hover:opacity-100"
            onClick={handleRemove}
          >
            <X className="size-3" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === 'upload' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setMode('upload')
                fileInputRef.current?.click()
              }}
            >
              <Upload className="size-4" />
              Upload
            </Button>
            <Button
              type="button"
              variant={mode === 'url' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('url')}
            >
              <LinkIcon className="size-4" />
              URL
            </Button>
          </div>

          {!mode && (
            <div className="flex h-28 w-28 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
              <div className="text-center">
                <ImageIcon className="mx-auto mb-1 size-6 text-muted-foreground/50" />
                <p className="text-xs text-muted-foreground/50">Nenhuma logo</p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {mode === 'url' && (
            <div className="flex gap-2">
              <Input
                placeholder="https://..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button type="button" variant="secondary" onClick={handleUrlConfirm}>
                <LinkIcon className="size-4" />
                Confirmar
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
