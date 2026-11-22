import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HeroSlide, ServiceCategory } from '../types'

interface HeroCarouselProps {
  slides: HeroSlide[]
  onPrimaryAction: (service?: ServiceCategory) => void
  onSecondaryAction: (targetSelector: string) => void
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 7500)
    return () => clearInterval(timer)
  }, [slides.length])

  const activeSlide = slides[currentIndex] || slides[0]
  if (!activeSlide) return null

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  return (
    <section
      id="inicio"
      className="relative h-[86vh] min-h-[600px] max-h-[920px] w-full overflow-hidden bg-[#0B0B0B]"
    >
      {/* Background Images with smooth crossfade + 35mm Ken Burns drift */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            idx === currentIndex ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className={`h-full w-full object-cover object-center ${
              idx === currentIndex ? 'animate-ken-burns' : ''
            }`}
          />
          {/* Cinematic scrim + subtle warm rim vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(243,107,33,0.14),transparent_48%)] pointer-events-none" />
        </div>
      ))}

      {/* Left / Right Carousel Controls (matching Tesla's clean square chevrons) */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Slide anterior"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-md bg-white/85 text-[#0B0B0B] shadow-lg backdrop-blur-sm transition hover:bg-white cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Próximo slide"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-md bg-white/85 text-[#0B0B0B] shadow-lg backdrop-blur-sm transition hover:bg-white cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Centered Hero Lockup (Tesla-style upper-center headline + twin buttons) */}
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-between px-6 pt-28 pb-24 text-center">
        <div key={activeSlide.id} className="space-y-4 max-w-3xl">
          <span className="animate-cinema-reveal inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F36B21]" />
            {activeSlide.badge}
          </span>

          <h1 className="animate-cinema-reveal cinema-delay-1 font-display text-3xl sm:text-5xl md:text-[54px] font-extrabold leading-[1.08] tracking-tight text-white drop-shadow-sm">
            {activeSlide.title}
          </h1>

          <p className="animate-cinema-reveal cinema-delay-2 font-display text-base sm:text-xl font-semibold text-white/90">
            {activeSlide.subtitle}
          </p>

          <p className="animate-cinema-reveal cinema-delay-3 mx-auto max-w-xl text-xs sm:text-sm text-[#E2E2E2] leading-relaxed">
            {activeSlide.description}
          </p>

          {/* Twin Tesla-style Rectangular CTAs */}
          <div className="animate-cinema-reveal cinema-delay-4 pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onPrimaryAction(activeSlide.accentService)}
              className="w-full sm:w-52 rounded-[4px] bg-[#F36B21] px-6 py-3 font-display text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#dc5b14] hover:-translate-y-0.5 cursor-pointer"
            >
              {activeSlide.primaryCta}
            </button>

            <button
              type="button"
              onClick={() => onSecondaryAction(activeSlide.targetSection)}
              className="w-full sm:w-52 rounded-[4px] bg-white px-6 py-3 font-display text-sm font-semibold text-[#0B0B0B] shadow-lg transition-all duration-300 hover:bg-[#F2F2F2] hover:-translate-y-0.5 cursor-pointer"
            >
              {activeSlide.secondaryCta}
            </button>
          </div>
        </div>

        {/* Slide Pagination Dots */}
        {slides.length > 1 && (
          <div className="flex items-center gap-2.5 pt-6">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir para slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'w-7 bg-[#F36B21]'
                    : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
