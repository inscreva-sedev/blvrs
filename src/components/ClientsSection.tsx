import React, { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Sparkles, X, Maximize2 } from 'lucide-react'
import { ClientCreativeItem, ClientLogoItem, ServiceCategory } from '../types'
import { Reveal } from './Reveal'

interface ClientsSectionProps {
  clients: ClientLogoItem[]
  creatives: ClientCreativeItem[]
  onOpenQuote: (service?: ServiceCategory, note?: string) => void
}

const CLIENT_FILTER_TABS = [
  'Todos',
  'Chicken Village',
  'Ali Baba',
  'Farmácia Viva Saúde',
  'IM Fisio',
]

export const ClientsSection: React.FC<ClientsSectionProps> = ({
  clients,
  creatives,
  onOpenQuote,
}) => {
  const [selectedClientTab, setSelectedClientTab] = useState<string>('Todos')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const creativesAnchorRef = useRef<HTMLDivElement>(null)
  const creativesTrackRef = useRef<HTMLDivElement>(null)

  const filteredCreatives =
    selectedClientTab === 'Todos'
      ? creatives
      : creatives.filter((item) => item.clientKey === selectedClientTab)

  const handleSelectClientFromLogo = (folderKey?: string) => {
    if (!folderKey) return
    setSelectedClientTab(folderKey)
    creativesAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollCreatives = (direction: 'left' | 'right') => {
    if (!creativesTrackRef.current) return
    const offset = direction === 'left' ? -520 : 520
    creativesTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  const activeLightboxItem =
    lightboxIndex !== null ? filteredCreatives[lightboxIndex] : null

  return (
    <section
      id="clientes"
      className="bg-[#F2F2F2] text-[#0B0B0B] py-16 sm:py-22 border-t border-black/5"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 space-y-16">
        {/* Part 1: 10 Client Logos */}
        <Reveal>
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F36B21]">
                Nossos Clientes
              </span>
              <h2 className="mt-1.5 font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0B0B0B]">
                Marcas, empresas e artistas que confiam na BLVRS MEDIA
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[#555]">
                Colaboramos com marcas de referência em diferentes sectores para construir
                comunicação consistente, visual forte e autoridade no mercado.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenQuote()}
              className="self-start md:self-auto rounded-[4px] bg-[#0B0B0B] px-5 py-2.5 font-display text-xs sm:text-sm font-semibold text-white transition hover:bg-[#F36B21] cursor-pointer"
            >
              Tornar-se parceiro
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {clients.map((client) => {
              const tileBg =
                client.fit === 'contain-black'
                  ? 'bg-[#0B0B0B]'
                  : client.fit === 'cover'
                  ? 'bg-[#171717]'
                  : 'bg-white'

              const creativeCount = client.creativesFolderKey
                ? creatives.filter((c) => c.clientKey === client.creativesFolderKey).length
                : 0
              const hasCreatives = creativeCount > 0

              return (
                <div
                  key={client.id}
                  onClick={() => handleSelectClientFromLogo(client.creativesFolderKey)}
                  className={`group flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#F36B21]/50 ${
                    hasCreatives ? 'cursor-pointer' : ''
                  }`}
                >
                  <div
                    className={`relative aspect-[4/3] w-full overflow-hidden flex items-center justify-center ${tileBg}`}
                  >
                    <img
                      src={client.image}
                      alt={client.name}
                      loading="lazy"
                      className={`transition-transform duration-500 group-hover:scale-105 ${
                        client.fit === 'cover'
                          ? 'h-full w-full object-cover'
                          : 'max-h-[78%] max-w-[82%] object-contain'
                      }`}
                    />

                    {hasCreatives && (
                      <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-[#F36B21] px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>{creativeCount} Peças</span>
                      </span>
                    )}
                  </div>

                  <div className="px-4 py-3 border-t border-black/5 bg-white flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-display text-xs sm:text-sm font-bold text-[#0B0B0B] truncate">
                        {client.name}
                      </p>
                      <p className="text-[11px] text-[#777] truncate mt-0.5">{client.sector}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          </div>
        </Reveal>

        {/* Part 2: Criativos Feitos para Clientes (4:5 Social Showcase) */}
        <Reveal delayMs={100}>
          <div
            id="criativos-clientes"
            ref={creativesAnchorRef}
            className="rounded-2xl bg-white border border-black/10 p-6 sm:p-10 shadow-sm"
          >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-7">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F36B21]">
                Social Media & Direcção de Arte
              </span>
              <h3 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B0B0B]">
                Criativos feitos para clientes
              </h3>
              <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-[#555]">
                Peças reais produzidas para campanhas digitais, promoções e posicionamento de
                marcas em redes sociais. Clique em qualquer peça para ampliar.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCreatives('left')}
                aria-label="Criativos anteriores"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-black/15 bg-[#F2F2F2] text-[#0B0B0B] transition hover:bg-[#0B0B0B] hover:text-white cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCreatives('right')}
                aria-label="Próximos criativos"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-black/15 bg-[#F2F2F2] text-[#0B0B0B] transition hover:bg-[#0B0B0B] hover:text-white cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Client Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-7">
            {CLIENT_FILTER_TABS.map((tab) => {
              const isActive = selectedClientTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setSelectedClientTab(tab)
                    creativesTrackRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
                  }}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-[#0B0B0B] text-white'
                      : 'bg-[#F2F2F2] text-[#555] hover:bg-[#e5e5e5] hover:text-[#0B0B0B]'
                  }`}
                >
                  {tab === 'Todos' ? `Todos (${creatives.length})` : tab}
                </button>
              )
            })}
          </div>

          {/* Horizontal 4:5 Portrait Showcase Track (zero cropping, clean frame) */}
          <div
            ref={creativesTrackRef}
            className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
          >
            {filteredCreatives.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className="group flex-none w-[72%] sm:w-[44%] md:w-[30%] lg:w-[23.5%] snap-start cursor-pointer"
              >
                <div className="cinema-card-sheen relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-black/10 bg-[#0B0B0B] shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-[#F36B21] group-hover:-translate-y-1">
                  <img
                    src={item.image}
                    alt={`${item.clientName} - ${item.title}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-white backdrop-blur-sm">
                    <Maximize2 className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-2 px-0.5">
                  <div className="min-w-0">
                    <p className="font-display text-xs font-bold text-[#0B0B0B] truncate">
                      {item.clientName}
                    </p>
                    <p className="text-[11px] text-[#777] truncate">{item.title}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F36B21] shrink-0">
                    Ver
                  </span>
                </div>
              </div>
            ))}
          </div>
          </div>
        </Reveal>
      </div>

      {/* Full-Size Lightbox Viewer for Client Creatives */}
      {activeLightboxItem && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="animate-modal relative flex flex-col md:flex-row w-full max-w-4xl overflow-hidden rounded-2xl bg-[#171717] text-white border border-white/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Fechar visualização"
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-[#F36B21] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Artwork Container */}
            <div className="relative flex-1 bg-black flex items-center justify-center p-4 sm:p-6 min-h-[360px] max-h-[75vh]">
              <img
                src={activeLightboxItem.image}
                alt={activeLightboxItem.title}
                className="max-h-[68vh] w-auto object-contain rounded-lg"
              />

              {filteredCreatives.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex(
                        (lightboxIndex - 1 + filteredCreatives.length) %
                          filteredCreatives.length
                      )
                    }
                    aria-label="Peça anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0B0B0B] hover:bg-white cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex((lightboxIndex + 1) % filteredCreatives.length)
                    }
                    aria-label="Próxima peça"
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0B0B0B] hover:bg-white cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Info Sidebar */}
            <div className="w-full md:w-72 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10">
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F36B21]">
                  Criativo para Cliente
                </span>
                <h4 className="font-display text-xl font-extrabold">
                  {activeLightboxItem.clientName}
                </h4>
                <p className="text-xs text-[#A6A6A6]">{activeLightboxItem.sector}</p>
                <p className="text-sm text-[#E5E5E5] pt-2">{activeLightboxItem.title}</p>
                <p className="text-xs text-[#A6A6A6] leading-relaxed">
                  Peça desenvolvida pela equipa da BLVRS MEDIA com foco em legibilidade,
                  identidade visual e conversão em redes sociais.
                </p>
              </div>

              <div className="pt-6 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const name = activeLightboxItem.clientName
                    setLightboxIndex(null)
                    onOpenQuote('Conteúdos Digitais', `Criativos estilo ${name}`)
                  }}
                  className="w-full rounded-[4px] bg-[#F36B21] py-2.5 font-display text-xs font-bold text-white hover:bg-[#dc5b14] cursor-pointer"
                >
                  Quero criativos para a minha marca
                </button>
                <p className="text-center text-[11px] text-[#A6A6A6]">
                  {lightboxIndex + 1} de {filteredCreatives.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
