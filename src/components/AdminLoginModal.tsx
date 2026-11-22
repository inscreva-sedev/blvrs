import React, { useState } from 'react'
import { Lock, Eye, EyeOff, X } from 'lucide-react'
import { AdminSession, loginAdmin } from '../lib/auth'

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (session: AdminSession) => void
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const session = await loginAdmin(email, password)
      setPassword('')
      onSuccess(session)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao iniciar sessão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-modal relative w-full max-w-md rounded-2xl border border-white/15 bg-[#0B0B0B] text-white p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar login administrativo"
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#171717] text-[#A6A6A6] hover:bg-[#F36B21] hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 space-y-3">
          <div className="inline-flex items-center rounded-xl bg-white px-3 py-1.5 shadow-sm">
            <img src="/blvrs-logo.png" alt="BLVRS MEDIA" className="h-9 w-auto object-contain" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F36B21]">
              Área Restrita
            </span>
            <h2 className="mt-1 font-display text-2xl font-extrabold">Painel Administrativo</h2>
            <p className="mt-1 text-xs text-[#A6A6A6]">
              Inicie sessão para gerir projectos, imagens, clientes, redes sociais e orçamentos.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#E5E5E5] mb-1.5">
              E-mail administrativo
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@blvrsmedia.com"
              className="w-full rounded-[4px] border border-white/15 bg-[#171717] px-3.5 py-2.5 text-sm text-white placeholder:text-[#666] focus:border-[#F36B21] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#E5E5E5] mb-1.5">
              Palavra-passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[4px] border border-white/15 bg-[#171717] px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-[#666] focus:border-[#F36B21] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Mostrar ou ocultar palavra-passe"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6A6A6] hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#F36B21] py-3 font-display text-sm font-semibold text-white transition hover:bg-[#dc5b14] disabled:opacity-60 cursor-pointer"
          >
            <Lock className="h-4 w-4" />
            <span>{loading ? 'A verificar...' : 'Entrar no Painel'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
