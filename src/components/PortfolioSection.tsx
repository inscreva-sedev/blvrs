import React, { useState } from 'react'
import { Play, Camera, Sparkles, X, ArrowUpRight, Layers } from 'lucide-react'
import { PortfolioCategory, ProjectItem, ServiceCategory } from '../types'
import { optimizeMediaUrl } from '../lib/cloudinary'
import { parseVideoUrl } from '../lib/video'
import { Reveal } from './Reveal'

interface PortfolioSectionProps {
  projects: ProjectItem[]
  activeCategory: PortfolioCategory
  onCategoryChange: (cat: PortfolioCategory) => void
  onRequestSimilar: (service?: ServiceCategory, projectTitle?: string) => void
  onOpenCms: () => void
}

const CATEGORIES: PortfolioCategory[] = [
  'Todos',
  'Audiovisual',
  'Fotografia',
  'Branding',
  'Conteúdos Digitais',
  'Bastidores',
]

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  projects,
  activeCategory,
  onCategoryChange,
  onRequestSimilar,
  onOpenCms,
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)

  const filteredProjects =
    activeCategory === 'Todos'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  const mapCategoryToService = (cat: ProjectItem['category']): ServiceCategory => {
    switch (cat) {
      case 'Audiovisual':
      case 'Bastidores':
        return 'Produção Audiovisual'
      case 'Fotografia':
        return 'Fotografia'
      case 'Branding':
        return 'Branding e Direcção Criativa'
      case 'Conteúdos Digitais':
        return 'Conteúdos Digitais'
    }
  }

  return (
    <section id="portfolio" className="bg-[#0B0B0B] text-white py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        {/* Section Header + Filter Pills */}
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F36B21]">
                04. Portefólio Seleccionado
              </span>
              <h2 className="mt-1.5 font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Trabalhos reais que posicionam marcas
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[#A6A6A6]">
                Explore produções audiovisuais, campanhas fotográficas, identidades visuais e
                bastidores desenvolvidos com foco em percepção e autoridade.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenCms}
              className="self-start lg:self-auto inline-flex items-center gap-2 rounded-[4px] border border-white/15 bg-[#171717] px-4 py-2 text-xs font-semibold text-white hover:border-[#F36B21] transition-colors cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5 text-[#F36B21]" />
              <span>Actualizar Portefólio</span>
            </button>
          </div>
        </Reveal>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#F36B21] text-white shadow-md'
                    : 'bg-[#171717] text-[#A6A6A6] hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Tesla-style Editorial Grid */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#171717] p-12 text-center">
            <p className="text-sm text-[#A6A6A6]">
              Ainda não existem projectos nesta categoria.
            </p>
            <button
              type="button"
              onClick={onOpenCms}
              className="mt-4 rounded-[4px] bg-[#F36B21] px-5 py-2.5 text-xs font-semibold text-white cursor-pointer"
            >
              Adicionar Projecto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj, index) => {
              const isHeroCard = index === 0 && filteredProjects.length >= 3
              return (
                <Reveal
                  key={proj.id}
                  delayMs={Math.min(index * 70, 280)}
                  className={isHeroCard ? 'md:col-span-2 lg:col-span-2' : ''}
                >
                  <article
                    onClick={() => setSelectedProject(proj)}
                    className="cinema-card-sheen group relative overflow-hidden rounded-xl bg-[#171717] border border-white/10 cursor-pointer transition-all duration-500 hover:border-[#F36B21]/60 hover:shadow-[0_20px_50px_rgba(0,0,0,0.65)] h-[380px] sm:h-[440px]"
                  >
                    <img
                      src={optimizeMediaUrl(proj.image, 1400)}
                      alt={proj.title}
                      loading="lazy"
                      className={`h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 ${
                        proj.id === 'proj-reel-estrategia' ? 'object-top' : 'object-center'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/15" />

                    {/* Top Badges */}
                    <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                        {proj.mediaType === 'video' && <Play className="h-3 w-3 text-[#F36B21]" />}
                        {proj.mediaType === 'photo' && <Camera className="h-3 w-3 text-[#F36B21]" />}
                        {proj.mediaType === 'campaign' && <Sparkles className="h-3 w-3 text-[#F36B21]" />}
                        <span>{proj.category}</span>
                      </span>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md">
                        {proj.year}
                      </span>
                    </div>

                    {/* Bottom Content */}
                    <div className="absolute bottom-6 left-6 right-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#F36B21]">
                        {proj.client}
                      </p>
                      <h3 className="mt-1 font-display text-xl sm:text-2xl font-extrabold text-white leading-snug">
                        {proj.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-[#D4D4D4] line-clamp-2">
                        {proj.summary}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-[#F36B21] transition-colors">
                        <span>Ver detalhes do projecto</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>

      {/* Project Case Study Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          {(() => {
            const parsed = parseVideoUrl(selectedProject.videoUrl)
            const isVerticalReel =
              parsed?.kind === 'iframe' &&
              parsed.provider === 'instagram' &&
              selectedProject.videoOrientation !== 'horizontal'
            const isHorizontalInstagram =
              parsed?.kind === 'iframe' &&
              parsed.provider === 'instagram' &&
              selectedProject.videoOrientation === 'horizontal'

            if (isVerticalReel) {
              return (
                <div
                  className="animate-modal relative flex flex-col md:flex-row w-full max-w-4xl max-h-[92vh] overflow-y-auto md:overflow-hidden rounded-2xl bg-[#171717] text-white border border-white/15 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Vertical 9:16 Reel Frame - Zero Scrim & Zero Overlap */}
                  <div className="relative w-full md:w-[340px] lg:w-[370px] bg-black shrink-0 flex items-center justify-center">
                    <div className="w-full h-[520px] md:h-[620px] max-h-[82vh]">
                      <iframe
                        src={parsed.src}
                        title={selectedProject.title}
                        className="h-full w-full border-0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  {/* Clean Concise Right Panel */}
                  <div className="relative flex-1 p-6 sm:p-8 flex flex-col justify-between gap-6">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(null)}
                      aria-label="Fechar projecto"
                      className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#F36B21] transition-colors cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <div className="space-y-5 pr-8">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#F36B21]">
                          <span>{selectedProject.category}</span>
                          <span className="text-[#A6A6A6]">•</span>
                          <span className="text-[#A6A6A6]">{selectedProject.client}</span>
                          <span className="text-[#A6A6A6]">•</span>
                          <span className="text-[#A6A6A6]">{selectedProject.year}</span>
                        </div>
                        <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight">
                          {selectedProject.title}
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-display text-[11px] font-bold uppercase tracking-widest text-[#A6A6A6]">
                          Resumo
                        </h4>
                        <p className="text-sm text-[#E5E5E5] leading-relaxed">
                          {selectedProject.summary}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-display text-[11px] font-bold uppercase tracking-widest text-[#A6A6A6]">
                          Estratégia
                        </h4>
                        <p className="text-sm text-[#E5E5E5] leading-relaxed">
                          {selectedProject.strategy}
                        </p>
                      </div>

                      {selectedProject.deliverables && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {selectedProject.deliverables.map((del) => (
                            <span
                              key={del}
                              className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-1 text-xs font-medium text-white"
                            >
                              {del}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                      {parsed.externalUrl && (
                        <a
                          href={parsed.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A6A6A6] hover:text-white underline underline-offset-4"
                        >
                          <span>Abrir no Instagram</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const srv = mapCategoryToService(selectedProject.category)
                          const projName = selectedProject.title
                          setSelectedProject(null)
                          onRequestSimilar(srv, projName)
                        }}
                        className="rounded-[4px] bg-[#F36B21] px-5 py-2.5 font-display text-xs sm:text-sm font-semibold text-white hover:bg-[#dc5b14] cursor-pointer"
                      >
                        Quero um projecto semelhante
                      </button>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div
                className="animate-modal relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#171717] text-white border border-white/15 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {isHorizontalInstagram && parsed?.kind === 'iframe' ? (
                  <>
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#111111]">
                      <span className="font-display text-xs font-bold uppercase tracking-widest text-[#F36B21]">
                        {selectedProject.client} • Vídeo Horizontal
                      </span>
                      <div className="flex items-center gap-3">
                        {parsed.externalUrl && (
                          <a
                            href={parsed.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#A6A6A6] hover:text-white underline"
                          >
                            <span>Abrir no Instagram</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedProject(null)}
                          aria-label="Fechar projecto"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#F36B21] transition-colors cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="w-full h-[360px] sm:h-[460px] bg-black">
                      <iframe
                        src={parsed.src}
                        title={selectedProject.title}
                        className="h-full w-full border-0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </>
                ) : (
                  <div className="relative h-64 sm:h-80 w-full bg-black">
                    {parsed?.kind === 'iframe' ? (
                      <>
                        <iframe
                          src={parsed.src}
                          title={selectedProject.title}
                          className="h-full w-full"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                        />
                        {parsed.externalUrl && (
                          <a
                            href={parsed.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute bottom-3 left-3 z-10 rounded-full bg-black/80 px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#F36B21] transition-colors"
                          >
                            Abrir vídeo original
                          </a>
                        )}
                      </>
                    ) : parsed?.kind === 'video' ? (
                      <video
                        src={parsed.src}
                        poster={selectedProject.image}
                        controls
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={selectedProject.image}
                        alt={selectedProject.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-black/30 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setSelectedProject(null)}
                      aria-label="Fechar projecto"
                      className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/75 text-white hover:bg-[#F36B21] transition-colors cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}

                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#F36B21]">
                      <span>{selectedProject.category}</span>
                      <span className="text-[#A6A6A6]">•</span>
                      <span className="text-[#A6A6A6]">{selectedProject.client}</span>
                      <span className="text-[#A6A6A6]">•</span>
                      <span className="text-[#A6A6A6]">{selectedProject.year}</span>
                    </div>
                    <h3 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold">
                      {selectedProject.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-display text-xs font-bold uppercase tracking-widest text-[#A6A6A6] mb-2">
                        Visão Geral
                      </h4>
                      <p className="text-sm text-[#E5E5E5] leading-relaxed">
                        {selectedProject.summary}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-display text-xs font-bold uppercase tracking-widest text-[#A6A6A6] mb-2">
                        Estratégia & Execução
                      </h4>
                      <p className="text-sm text-[#E5E5E5] leading-relaxed">
                        {selectedProject.strategy}
                      </p>
                    </div>
                  </div>

                  {selectedProject.deliverables && (
                    <div>
                      <h4 className="font-display text-xs font-bold uppercase tracking-widest text-[#A6A6A6] mb-3">
                        Entregáveis do Projecto
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.deliverables.map((del) => (
                          <span
                            key={del}
                            className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-1.5 text-xs font-medium text-white"
                          >
                            {del}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                    <div>
                      <h4 className="font-display text-xs font-bold uppercase tracking-widest text-[#A6A6A6] mb-3">
                        Criativos da Campanha ({selectedProject.gallery.length})
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {selectedProject.gallery.map((imgUrl, idx) => (
                          <div
                            key={imgUrl}
                            className="overflow-hidden rounded-lg border border-white/10 bg-[#0B0B0B] aspect-[4/5]"
                          >
                            <img
                              src={imgUrl}
                              alt={`${selectedProject.title} - Peça ${idx + 1}`}
                              className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(null)}
                      className="rounded-[4px] border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 cursor-pointer"
                    >
                      Fechar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const srv = mapCategoryToService(selectedProject.category)
                        const projName = selectedProject.title
                        setSelectedProject(null)
                        onRequestSimilar(srv, projName)
                      }}
                      className="rounded-[4px] bg-[#F36B21] px-6 py-2.5 font-display text-sm font-semibold text-white hover:bg-[#dc5b14] cursor-pointer"
                    >
                      Quero um projecto semelhante
                    </button>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </section>
  )
}
