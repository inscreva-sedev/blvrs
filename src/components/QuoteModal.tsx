import React, { useEffect, useState } from 'react'
import { X, MessageCircle, Send, CheckCircle2 } from 'lucide-react'
import { QuoteSubmission, ServiceCategory, SiteConfig } from '../types'

interface QuoteModalProps {
  isOpen: boolean
  config: SiteConfig
  initialService?: ServiceCategory
  initialNote?: string
  onClose: () => void
  onSubmitQuote: (quote: QuoteSubmission) => void
}

const SERVICES: ServiceCategory[] = [
  'Produção Audiovisual',
  'Fotografia',
  'Branding e Direcção Criativa',
  'Conteúdos Digitais',
  'Estratégia e Consultoria',
]

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  config,
  initialService,
  initialNote,
  onClose,
  onSubmitQuote,
}) => {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState<string>(initialService || 'Produção Audiovisual')
  const [message, setMessage] = useState(initialNote || '')
  const [doneQuote, setDoneQuote] = useState<QuoteSubmission | null>(null)

  useEffect(() => {
    if (initialService) setService(initialService)
    if (initialNote) setMessage(`Referência: ${initialNote}\n`)
  }, [initialService, initialNote])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return

    const quote: QuoteSubmission = {
      id: `qm-${Date.now()}`,
      name: name.trim(),
      company: company.trim() || 'Marca / Particular',
      email: email.trim(),
      phone: phone.trim() || 'Não indicado',
      service,
      budgetRange: 'Sob consulta',
      timeline: 'A combinar',
      message: message.trim(),
      createdAt: new Date().toISOString(),
    }

    onSubmitQuote(quote)
    setDoneQuote(quote)
    setName('')
    setCompany('')
    setEmail('')
    setPhone('')
    setMessage('')
  }

  const getWaUrl = (quote: QuoteSubmission) => {
    const text = `Olá BLVRS MEDIA! Pedido de orçamento rápido:\n• Nome: ${quote.name}\n• Marca: ${quote.company}\n• Serviço: ${quote.service}\n• Briefing: ${quote.message}`
    return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-modal relative w-full max-w-lg rounded-2xl bg-white text-[#0B0B0B] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar modal"
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F2F2] text-[#0B0B0B] hover:bg-[#0B0B0B] hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {doneQuote ? (
          <div className="space-y-5 py-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-extrabold">Pedido enviado!</h3>
              <p className="mt-2 text-sm text-[#555]">
                Recebemos o seu pedido para <strong>{doneQuote.service}</strong>. Quer agilizar
                enviando também para o nosso WhatsApp?
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <a
                href={getWaUrl(doneQuote)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#F36B21] py-3 font-display text-sm font-semibold text-white hover:bg-[#dc5b14]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Enviar via WhatsApp ({config.whatsappDisplay})</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setDoneQuote(null)
                  onClose()
                }}
                className="rounded-[4px] bg-[#F2F2F2] py-2.5 text-sm font-semibold text-[#0B0B0B] cursor-pointer"
              >
                Voltar à página
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F36B21]">
                BLVRS MEDIA • Atendimento Rápido
              </span>
              <h3 className="mt-1 font-display text-2xl font-extrabold">Solicitar Orçamento</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome *"
                className="rounded-[4px] border border-black/15 bg-[#F2F2F2]/60 px-3.5 py-2.5 text-sm focus:border-[#F36B21] focus:bg-white focus:outline-none"
              />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Empresa / Projecto"
                className="rounded-[4px] border border-black/15 bg-[#F2F2F2]/60 px-3.5 py-2.5 text-sm focus:border-[#F36B21] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail *"
                className="rounded-[4px] border border-black/15 bg-[#F2F2F2]/60 px-3.5 py-2.5 text-sm focus:border-[#F36B21] focus:bg-white focus:outline-none"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="WhatsApp / Telefone"
                className="rounded-[4px] border border-black/15 bg-[#F2F2F2]/60 px-3.5 py-2.5 text-sm focus:border-[#F36B21] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Serviço desejado</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full rounded-[4px] border border-black/15 bg-[#F2F2F2]/60 px-3 py-2.5 text-sm focus:border-[#F36B21] focus:bg-white focus:outline-none"
              >
                {SERVICES.map((srv) => (
                  <option key={srv} value={srv}>
                    {srv}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Conte-nos brevemente o que pretende produzir ou posicionar..."
              className="w-full rounded-[4px] border border-black/15 bg-[#F2F2F2]/60 px-3.5 py-2.5 text-sm focus:border-[#F36B21] focus:bg-white focus:outline-none"
            />

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#F36B21] py-3 font-display text-sm font-semibold text-white hover:bg-[#dc5b14] cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Enviar Pedido</span>
              </button>
              <a
                href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
                  `Olá BLVRS MEDIA! Gostaria de falar sobre ${service}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#0B0B0B] px-4 py-3 font-display text-sm font-semibold text-white hover:bg-[#171717]"
              >
                <MessageCircle className="h-4 w-4 text-[#F36B21]" />
                <span>WhatsApp Directo</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
