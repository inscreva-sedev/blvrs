import React from 'react'
import { MessageCircle, Sparkles } from 'lucide-react'
import { SiteConfig } from '../types'

interface FloatingBarProps {
  config: SiteConfig
  onOpenQuote: () => void
}

/* Inspired directly by Tesla's bottom-centered floating action pill */
export const FloatingBar: React.FC<FloatingBarProps> = ({ config, onOpenQuote }) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-lg border border-black/10 bg-white/95 px-2.5 py-1.5 text-[#0B0B0B] shadow-[0_8px_30px_rgba(0,0,0,0.22)] backdrop-blur-md">
      <button
        type="button"
        onClick={onOpenQuote}
        className="inline-flex items-center gap-2 rounded-md px-3.5 py-2 font-display text-xs sm:text-sm font-bold text-[#0B0B0B] hover:bg-[#F2F2F2] transition-colors cursor-pointer"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F36B21] text-white">
          <Sparkles className="h-3 w-3" />
        </span>
        <span>Solicitar Orçamento</span>
      </button>

      <div className="h-5 w-px bg-black/10" />

      <a
        href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
          'Olá BLVRS MEDIA! Gostaria de conversar sobre um projecto.'
        )}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md bg-[#0B0B0B] px-3 py-2 font-display text-xs font-semibold text-white hover:bg-[#F36B21] transition-colors"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </div>
  )
}
