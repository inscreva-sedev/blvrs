import React, { useState } from 'react'
import { Target, Eye, Compass, Calendar, Layers, Play, X } from 'lucide-react'
import { CONTENT_PILLARS } from '../data/blvrsData'
import { SiteConfig } from '../types'
import { Reveal } from './Reveal'
import { parseVideoUrl } from '../lib/video'

interface AboutAndPillarsProps {
  config: SiteConfig
  onOpenQuote: () => void
}

export const AboutAndPillars: React.FC<AboutAndPillarsProps> = ({ config, onOpenQuote }) => {
  const [playingVideo, setPlayingVideo] = useState(false)
  const parsedVideo = parseVideoUrl(config.aboutVideoUrl)
  const mediaPoster = config.aboutImage || '/images/hero-branding.jpg'

  return (
    <>
      {/* 02. Sobre Nós - High-Contrast White Editorial Section */}
      <section id="sobre" className="bg-white text-[#0B0B0B] py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <Reveal className="lg:col-span-6 space-y-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F36B21]">
                02. Sobre Nós
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] text-[#0B0B0B]">
                Comunicação, estratégia e produção audiovisual.
              </h2>
              <p className="text-sm sm:text-base text-[#333] leading-relaxed">
                A <strong className="text-[#0B0B0B]">BLVRS MEDIA</strong> cria conteúdos visuais e
                estratégias para marcas, empresas e artistas comunicarem com intenção e clareza.
              </p>
              <p className="text-sm sm:text-base text-[#333] leading-relaxed">
                Mais do que publicar, construímos percepção, fortalecemos identidades e geramos
                autoridade no mercado.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onOpenQuote}
                  className="rounded-[4px] bg-[#0B0B0B] px-6 py-3 font-display text-sm font-semibold text-white transition hover:bg-[#F36B21] cursor-pointer"
                >
                  Agendar reunião criativa
                </button>
                <a
                  href="#pilares"
                  className="rounded-[4px] bg-[#F2F2F2] px-6 py-3 font-display text-sm font-semibold text-[#0B0B0B] transition hover:bg-[#e5e5e5]"
                >
                  Conhecer a nossa metodologia
                </a>
              </div>
            </Reveal>

            {/* Right Visual + Mission/Vision/Values */}
            <Reveal delayMs={140} className="lg:col-span-6 space-y-5">
              <div className="cinema-card-sheen relative h-72 sm:h-80 overflow-hidden rounded-xl bg-[#171717] group">
                {playingVideo &&
                parsedVideo &&
                !(parsedVideo.kind === 'iframe' && parsedVideo.provider === 'instagram') ? (
                  <div className="relative h-full w-full bg-black">
                    {parsedVideo.kind === 'iframe' ? (
                      <iframe
                        src={parsedVideo.src}
                        title="Vídeo Institucional BLVRS MEDIA"
                        className="h-full w-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={parsedVideo.src}
                        poster={mediaPoster}
                        controls
                        autoPlay
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setPlayingVideo(false)}
                      aria-label="Voltar para imagem"
                      className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-white hover:bg-[#F36B21] transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <img
                      src={mediaPoster}
                      alt="Direcção criativa BLVRS MEDIA"
                      className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {parsedVideo && (
                      <button
                        type="button"
                        onClick={() => setPlayingVideo(true)}
                        aria-label="Reproduzir vídeo institucional"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 rounded-full bg-[#F36B21]/95 px-5 py-3 font-display text-xs sm:text-sm font-bold text-white shadow-2xl backdrop-blur-md transition-transform duration-300 hover:scale-105 hover:bg-[#F36B21] cursor-pointer"
                      >
                        <Play className="h-4 w-4 fill-white" />
                        <span>Ver Vídeo</span>
                      </button>
                    )}

                    <div className="absolute bottom-5 left-6 right-6 text-white pointer-events-none">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F36B21]">
                        Posicionamento Institucional
                      </p>
                      <p className="mt-1 font-display text-lg sm:text-xl font-bold">
                        {config.positioning}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-[#F2F2F2] p-5">
                  <Target className="h-5 w-5 text-[#F36B21]" />
                  <h3 className="mt-3 font-display text-sm font-bold text-[#0B0B0B]">Missão</h3>
                  <p className="mt-1.5 text-xs text-[#444] leading-relaxed">
                    Criar conteúdos e estratégias visuais que elevam marcas e aproximam ideias das
                    pessoas certas.
                  </p>
                </div>

                <div className="rounded-xl bg-[#F2F2F2] p-5">
                  <Eye className="h-5 w-5 text-[#F36B21]" />
                  <h3 className="mt-3 font-display text-sm font-bold text-[#0B0B0B]">Visão</h3>
                  <p className="mt-1.5 text-xs text-[#444] leading-relaxed">
                    Ser referência em comunicação estratégica, estética editorial e produção
                    audiovisual de alto padrão.
                  </p>
                </div>

                <div className="rounded-xl bg-[#F2F2F2] p-5">
                  <Compass className="h-5 w-5 text-[#F36B21]" />
                  <h3 className="mt-3 font-display text-sm font-bold text-[#0B0B0B]">Valores</h3>
                  <p className="mt-1.5 text-xs text-[#444] leading-relaxed">
                    Intenção, consistência, sofisticação visual, clareza estratégica e rigor
                    técnico.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Vertical 9:16 Modal for Instagram Reel in Sobre Nós */}
      {playingVideo && parsedVideo?.kind === 'iframe' && parsedVideo.provider === 'instagram' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setPlayingVideo(false)}
        >
          <div
            className="animate-modal relative w-full max-w-[390px] overflow-hidden rounded-2xl bg-[#171717] border border-white/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="font-display text-xs font-bold uppercase tracking-widest text-[#F36B21]">
                BLVRS MEDIA • Reel
              </span>
              <div className="flex items-center gap-3">
                {parsedVideo.externalUrl && (
                  <a
                    href={parsedVideo.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold text-[#A6A6A6] hover:text-white underline"
                  >
                    Instagram
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setPlayingVideo(false)}
                  aria-label="Fechar vídeo"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#F36B21] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="w-full h-[580px] max-h-[78vh] bg-black">
              <iframe
                src={parsedVideo.src}
                title="Instagram Reel BLVRS MEDIA"
                className="h-full w-full border-0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Identidade Visual & Pilares de Conteúdo - Dark Editorial Band */}
      <section id="pilares" className="bg-[#171717] text-white py-16 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 space-y-16">
          {/* Pilares de Conteúdo */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F36B21]">
                  Metodologia Editorial
                </span>
                <h2 className="mt-1.5 font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
                  5 Pilares de Comunicação & Consistência
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0B0B0B] px-4 py-2 text-xs text-[#A6A6A6]">
                <Calendar className="h-4 w-4 text-[#F36B21]" />
                <span>Frequência recomendada: 3 publicações/semana + Stories</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {CONTENT_PILLARS.map((pillar, i) => (
                <div
                  key={pillar.id}
                  className="rounded-xl border border-white/10 bg-[#0B0B0B] p-6 flex flex-col justify-between transition hover:border-[#F36B21]/60"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-extrabold text-[#F36B21]">
                        0{i + 1}
                      </span>
                      <span className="text-[11px] font-medium text-[#A6A6A6]">
                        {pillar.frequency}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-base font-bold text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#A6A6A6] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Identidade Visual Strip (Preto / Branco / Laranja) */}
          <div id="identidade" className="rounded-2xl border border-white/10 bg-[#0B0B0B] p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F36B21]">
                  <Layers className="h-3.5 w-3.5" />
                  DNA Visual BLVRS MEDIA
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold">
                  Estética minimalista, editorial e autoridade visual.
                </h3>
                <p className="text-sm text-[#A6A6A6] leading-relaxed">
                  O preto e o branco estruturam a sofisticação e clareza da marca, enquanto o
                  laranja destaca acções estratégicas e energia criativa.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-white/15 bg-[#0B0B0B] p-5">
                  <div className="h-10 w-10 rounded-lg bg-[#0B0B0B] border border-white/25 mb-4" />
                  <p className="font-display text-sm font-bold text-white">Preto Profundo</p>
                  <p className="text-xs text-[#A6A6A6] mt-0.5">#0B0B0B • #171717</p>
                  <p className="mt-2 text-xs text-[#A6A6A6]">
                    Sofisticação, autoridade, elegância e força visual.
                  </p>
                </div>

                <div className="rounded-xl bg-white text-[#0B0B0B] p-5">
                  <div className="h-10 w-10 rounded-lg bg-white border border-black/15 mb-4" />
                  <p className="font-display text-sm font-bold">Branco Puro</p>
                  <p className="text-xs text-[#555] mt-0.5">#FFFFFF • #F2F2F2</p>
                  <p className="mt-2 text-xs text-[#444]">
                    Clareza, simplicidade, equilíbrio e profissionalismo.
                  </p>
                </div>

                <div className="rounded-xl bg-[#F36B21] text-white p-5">
                  <div className="h-10 w-10 rounded-lg bg-white/20 border border-white/30 mb-4" />
                  <p className="font-display text-sm font-bold">Laranja BLVRS</p>
                  <p className="text-xs text-white/85 mt-0.5">#F36B21</p>
                  <p className="mt-2 text-xs text-white/95">
                    Criatividade, energia, dinamismo e diferenciação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
