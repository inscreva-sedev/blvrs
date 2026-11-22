import React, { useState } from 'react'
import {
  Phone,
  Mail,
  MessageCircle,
  Send,
  CheckCircle2,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Share2,
  MapPin,
} from 'lucide-react'
import { QuoteSubmission, ServiceCategory, SiteConfig } from '../types'

interface ContactSectionProps {
  config: SiteConfig
  preselectedService?: ServiceCategory
  onQuoteSubmitted: (quote: QuoteSubmission) => void
}

const SERVICE_OPTIONS: ServiceCategory[] = [
  'Produção Audiovisual',
  'Fotografia',
  'Branding e Direcção Criativa',
  'Conteúdos Digitais',
  'Estratégia e Consultoria',
]

export const ContactSection: React.FC<ContactSectionProps> = ({
  config,
  preselectedService,
  onQuoteSubmitted,
}) => {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState<string>(
    preselectedService || 'Produção Audiovisual'
  )
  const [budgetRange, setBudgetRange] = useState('A definir sob consulta')
  const [timeline, setTimeline] = useState('Este mês')
  const [message, setMessage] = useState('')
  const [submittedQuote, setSubmittedQuote] = useState<QuoteSubmission | null>(null)

  React.useEffect(() => {
    if (preselectedService) {
      setService(preselectedService)
    }
  }, [preselectedService])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return

    const submission: QuoteSubmission = {
      id: `q-${Date.now()}`,
      name: name.trim(),
      company: company.trim() || 'Marca / Projecto Individual',
      email: email.trim(),
      phone: phone.trim() || 'Não indicado',
      service,
      budgetRange,
      timeline,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    }

    onQuoteSubmitted(submission)
    setSubmittedQuote(submission)
    setName('')
    setCompany('')
    setEmail('')
    setPhone('')
    setMessage('')
  }

  const buildWhatsAppUrl = (quote: QuoteSubmission) => {
    const text = `Olá BLVRS MEDIA! Gostaria de solicitar um orçamento:\n• Nome: ${quote.name}\n• Marca/Empresa: ${quote.company}\n• Serviço: ${quote.service}\n• Prazo: ${quote.timeline}\n• Investimento estimado: ${quote.budgetRange}\n• Detalhes: ${quote.message}`
    return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`
  }

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return <Instagram className="h-4 w-4" />
      case 'Facebook':
        return <Facebook className="h-4 w-4" />
      case 'LinkedIn':
        return <Linkedin className="h-4 w-4" />
      case 'YouTube':
        return <Youtube className="h-4 w-4" />
      default:
        return <Share2 className="h-4 w-4" />
    }
  }

  return (
    <section id="contactos" className="bg-[#0B0B0B] text-white py-16 sm:py-24 border-t border-white/10">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Contacts & Social Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F36B21]">
                05. Contactos Oficiais
              </span>
              <h2 className="mt-1.5 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                Vamos construir o seu próximo projecto.
              </h2>
              <p className="mt-3 text-sm text-[#A6A6A6] leading-relaxed">
                Entre em contacto directo com a nossa equipa para pedidos de orçamento, produção
                audiovisual, sessões fotográficas ou consultoria de marca.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href={`tel:${config.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#171717] p-4 transition hover:border-[#F36B21]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0B0B0B] text-[#F36B21]">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-[#A6A6A6]">Telefone</p>
                  <p className="font-display text-sm sm:text-base font-bold text-white">
                    {config.phone}
                  </p>
                </div>
              </a>

              <a
                href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
                  'Olá BLVRS MEDIA! Gostaria de solicitar uma cotação.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 rounded-xl border border-[#F36B21]/40 bg-[#171717] p-4 transition hover:bg-[#F36B21]/10"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F36B21] text-white">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-[#A6A6A6]">WhatsApp e Chamadas</p>
                    <p className="font-display text-sm sm:text-base font-bold text-white">
                      {config.whatsappDisplay}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-[#F36B21]/20 px-3 py-1 text-[11px] font-semibold text-[#F36B21]">
                  Resposta rápida
                </span>
              </a>

              <a
                href={`mailto:${config.email}`}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#171717] p-4 transition hover:border-[#F36B21]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0B0B0B] text-[#F36B21]">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-[#A6A6A6]">E-mail Corporativo / Bookings</p>
                  <p className="font-display text-sm sm:text-base font-bold text-white">
                    {config.email}
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#171717] p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0B0B0B] text-[#A6A6A6]">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-[#A6A6A6]">Base de Operações</p>
                  <p className="font-display text-sm font-bold text-white">{config.location}</p>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-widest text-[#A6A6A6] mb-3">
                Redes Sociais Oficiais
              </p>
              <div className="flex flex-wrap gap-2.5">
                {config.socials
                  .filter((s) => s.active)
                  .map((soc) => (
                    <a
                      key={soc.platform}
                      href={soc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#171717] px-3.5 py-2 text-xs font-semibold text-white transition hover:border-[#F36B21] hover:text-[#F36B21]"
                    >
                      {renderSocialIcon(soc.platform)}
                      <span>{soc.platform}</span>
                    </a>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column: Quote Request Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white text-[#0B0B0B] p-6 sm:p-10 shadow-2xl">
              <div className="mb-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F36B21]">
                  Pedido de Orçamento
                </span>
                <h3 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold">
                  Solicite uma proposta à medida
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-[#555]">
                  Preencha o briefing abaixo para receber uma cotação detalhada por e-mail ou
                  WhatsApp.
                </p>
              </div>

              {submittedQuote ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-display text-lg font-bold text-[#0B0B0B]">
                        Pedido registado com sucesso!
                      </h4>
                      <p className="mt-1 text-sm text-[#333]">
                        Obrigado, <strong>{submittedQuote.name}</strong>. O seu pedido para{' '}
                        <strong>{submittedQuote.service}</strong> foi guardado. Pode também enviá-lo
                        directamente para o nosso WhatsApp comercial para atendimento imediato.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a
                      href={buildWhatsAppUrl(submittedQuote)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-[4px] bg-[#F36B21] px-5 py-2.5 font-display text-sm font-semibold text-white hover:bg-[#dc5b14]"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Enviar resumo no WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmittedQuote(null)}
                      className="rounded-[4px] border border-black/15 px-5 py-2.5 text-sm font-semibold text-[#0B0B0B] hover:bg-black/5 cursor-pointer"
                    >
                      Novo pedido
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0B0B0B] mb-1.5">
                        Nome completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: João Macuácua"
                        className="w-full rounded-[4px] border border-black/15 bg-[#F2F2F2]/60 px-3.5 py-2.5 text-sm text-[#0B0B0B] focus:border-[#F36B21] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0B0B0B] mb-1.5">
                        Marca, Empresa ou Artista
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Ex: Horizonte Energia"
                        className="w-full rounded-[4px] border border-black/15 bg-[#F2F2F2]/60 px-3.5 py-2.5 text-sm text-[#0B0B0B] focus:border-[#F36B21] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0B0B0B] mb-1.5">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nome@empresa.com"
                        className="w-full rounded-[4px] border border-black/15 bg-[#F2F2F2]/60 px-3.5 py-2.5 text-sm text-[#0B0B0B] focus:border-[#F36B21] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0B0B0B] mb-1.5">
                        Telefone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+258 84 000 0000"
                        className="w-full rounded-[4px] border border-black/15 bg-[#F2F2F2]/60 px-3.5 py-2.5 text-sm text-[#0B0B0B] focus:border-[#F36B21] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-semibold text-[#0B0B0B] mb-1.5">
                        Serviço principal
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full rounded-[4px] border border-black/15 bg-[#F2F2F2]/60 px-3 py-2.5 text-sm text-[#0B0B0B] focus:border-[#F36B21] focus:bg-white focus:outline-none"
                      >
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-xs font-semibold text-[#0B0B0B] mb-1.5">
                        Prazo desejado
                      </label>
                      <select
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="w-full rounded-[4px] border border-black/15 bg-[#F2F2F2]/60 px-3 py-2.5 text-sm text-[#0B0B0B] focus:border-[#F36B21] focus:bg-white focus:outline-none"
                      >
                        <option value="Urgente (esta semana)">Urgente (esta semana)</option>
                        <option value="Este mês">Este mês</option>
                        <option value="Próximos 2–3 meses">Próximos 2–3 meses</option>
                        <option value="Acompanhamento mensal">Acompanhamento mensal</option>
                      </select>
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-xs font-semibold text-[#0B0B0B] mb-1.5">
                        Orçamento estimado
                      </label>
                      <select
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                        className="w-full rounded-[4px] border border-black/15 bg-[#F2F2F2]/60 px-3 py-2.5 text-sm text-[#0B0B0B] focus:border-[#F36B21] focus:bg-white focus:outline-none"
                      >
                        <option value="A definir sob consulta">A definir sob consulta</option>
                        <option value="Projecto Pontual">Projecto Pontual</option>
                        <option value="Campanha Completa">Campanha Completa</option>
                        <option value="Retainer / Gestão Mensal">Retainer / Gestão Mensal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0B0B0B] mb-1.5">
                      Sobre o projecto e objectivos *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Descreva a sua ideia, objectivo da campanha, referências ou data do evento..."
                      className="w-full rounded-[4px] border border-black/15 bg-[#F2F2F2]/60 px-3.5 py-2.5 text-sm text-[#0B0B0B] focus:border-[#F36B21] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#F36B21] px-7 py-3 font-display text-sm font-semibold text-white transition hover:bg-[#dc5b14] cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                      <span>Solicitar Orçamento</span>
                    </button>
                    <span className="text-xs text-[#777]">
                      Ou envie directo para{' '}
                      <a href={`mailto:${config.email}`} className="underline text-[#0B0B0B]">
                        {config.email}
                      </a>
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
