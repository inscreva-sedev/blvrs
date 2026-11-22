import React, { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, X, ArrowRight } from 'lucide-react'
import { ServiceCategory, ServiceItem } from '../types'
import { Reveal } from './Reveal'

interface ServicesShowcaseProps {
  services: ServiceItem[]
  onRequestQuote: (service: ServiceCategory) => void
}

export const ServicesShowcase: React.FC<ServicesShowcaseProps> = ({
  services,
  onRequestQuote,
}) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null)

  const scrollTrack = (direction: 'left' | 'right') => {
    if (!trackRef.current) return
    const width = trackRef.current.clientWidth
    const offset = direction === 'left' ? -(width * 0.68) : width * 0.68
    trackRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <section id="servicos" className="bg-white text-[#0B0B0B] py-14 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        {/* Clean Editorial Header */}
        <Reveal>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F36B21]">
                03. Serviços Especializados
              </span>
              <h2 className="mt-1.5 font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0B0B0B]">
                Soluções criativas com intenção estratégica
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollTrack('left')}
                aria-label="Serviços anteriores"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-black/15 bg-[#F2F2F2] text-[#0B0B0B] transition hover:bg-[#0B0B0B] hover:text-white cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollTrack('right')}
                aria-label="Próximos serviços"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-black/15 bg-[#F2F2F2] text-[#0B0B0B] transition hover:bg-[#0B0B0B] hover:text-white cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Tesla-style Horizontal Peek Carousel (matching Powerwall / Megapack & SUV / Sedan cards) */}
        <Reveal delayMs={120}>
          <div
            ref={trackRef}
            className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
          >
            {services.map((srv) => (
              <article
                key={srv.id}
                className="cinema-card-sheen group relative flex-none w-[88%] sm:w-[68%] lg:w-[58%] h-[430px] sm:h-[500px] snap-start overflow-hidden rounded-xl bg-[#171717]"
              >
                <img
                  src={srv.image}
                  alt={srv.title}
                  className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
                />

              {/* Bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />

              {/* Top pill badge */}
              <div className="absolute top-5 left-5 sm:top-7 sm:left-7">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/55 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-white backdrop-blur-md">
                  <span className="text-[#F36B21] font-bold">{srv.number}</span>
                  <span>Especialidade</span>
                </span>
              </div>

              {/* Bottom-left white text & twin action buttons (exact Tesla card pattern) */}
              <div className="absolute bottom-6 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 text-white">
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {srv.title}
                </h3>
                <p className="mt-1.5 max-w-xl text-sm sm:text-base text-white/85">
                  {srv.tagline}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onRequestQuote(srv.title)}
                    className="rounded-[4px] bg-[#F36B21] px-5 py-2.5 font-display text-xs sm:text-sm font-semibold text-white transition hover:bg-[#dc5b14] cursor-pointer"
                  >
                    Solicitar um orçamento
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedService(srv)}
                    className="rounded-[4px] bg-white px-5 py-2.5 font-display text-xs sm:text-sm font-semibold text-[#0B0B0B] transition hover:bg-[#F2F2F2] cursor-pointer"
                  >
                    Saber mais
                  </button>
                </div>
              </div>
            </article>
          ))}
          </div>
        </Reveal>

        {/* Compact Quick Overview Grid of All 5 Areas */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {services.map((srv) => (
            <button
              key={srv.id}
              type="button"
              onClick={() => setSelectedService(srv)}
              className="group text-left rounded-xl border border-black/10 bg-[#F2F2F2]/70 p-5 transition hover:border-[#0B0B0B] hover:bg-white cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-extrabold text-[#F36B21]">
                  {srv.number}
                </span>
                <ArrowRight className="h-4 w-4 text-[#A6A6A6] transition-transform group-hover:translate-x-1 group-hover:text-[#0B0B0B]" />
              </div>
              <h4 className="mt-3 font-display text-sm font-bold text-[#0B0B0B]">
                {srv.title}
              </h4>
              <p className="mt-1.5 text-xs text-[#555] line-clamp-2">{srv.summary}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="animate-modal relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white text-[#0B0B0B] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 w-full">
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                aria-label="Fechar detalhes"
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0B0B0B] hover:bg-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-xs font-bold uppercase tracking-widest text-[#F36B21]">
                  Serviço {selectedService.number}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold">
                  {selectedService.title}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-sm sm:text-base text-[#333] leading-relaxed">
                {selectedService.summary}
              </p>

              <div>
                <h4 className="font-display text-xs font-bold uppercase tracking-widest text-[#A6A6A6] mb-3">
                  O que entregamos
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedService.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#0B0B0B]">
                      <CheckCircle2 className="h-4 w-4 text-[#F36B21] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-[#F2F2F2] p-4 text-xs sm:text-sm text-[#333]">
                <strong className="text-[#0B0B0B]">Indicado para:</strong>{' '}
                {selectedService.idealFor}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="rounded-[4px] border border-black/15 px-5 py-2.5 text-sm font-semibold text-[#0B0B0B] hover:bg-[#F2F2F2] cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const srvTitle = selectedService.title
                    setSelectedService(null)
                    onRequestQuote(srvTitle)
                  }}
                  className="rounded-[4px] bg-[#F36B21] px-6 py-2.5 font-display text-sm font-semibold text-white hover:bg-[#dc5b14] cursor-pointer"
                >
                  Pedir cotação para {selectedService.shortTitle}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
