import React, { useEffect, useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

const SECTION_IDS = [
  '#inicio',
  '#servicos',
  '#clientes',
  '#portfolio',
  '#sobre',
  '#fundador',
  '#pilares',
  '#contactos',
]

export const ScrollControl: React.FC = () => {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      if (docHeight <= 0) {
        setPercent(0)
        return
      }
      const next = Math.round(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)))
      setPercent(next)
    }

    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [])

  const scrollStep = (direction: 'up' | 'down') => {
    const currentY = window.scrollY
    const positions = SECTION_IDS.map((id) => {
      const el = document.querySelector(id)
      return el ? el.getBoundingClientRect().top + currentY : null
    }).filter((v): v is number => v !== null)

    if (direction === 'up') {
      const prev = [...positions].reverse().find((y) => y < currentY - 60)
      window.scrollTo({ top: prev !== undefined ? prev : 0, behavior: 'smooth' })
    } else {
      const next = positions.find((y) => y > currentY + 60)
      if (next !== undefined) {
        window.scrollTo({ top: next, behavior: 'smooth' })
      } else {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        })
      }
    }
  }

  // SVG circular ring math
  const radius = 15
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percent / 100) * circumference

  return (
    <div
      aria-label="Controlo de navegação vertical"
      className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-center gap-2 rounded-full border border-black/10 bg-white/95 p-1.5 text-[#0B0B0B] shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-md"
    >
      {/* Up Button */}
      <button
        type="button"
        onClick={() => scrollStep('up')}
        aria-label="Subir secção"
        title="Subir"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F36B21]/10 text-[#F36B21] transition-colors hover:bg-[#F36B21]/20 cursor-pointer"
      >
        <ChevronUp className="h-4 w-4 stroke-[2.5]" />
      </button>

      {/* Percentage Readout */}
      <span className="font-display text-[11px] font-bold tabular-nums text-[#0B0B0B] select-none leading-none py-0.5">
        {percent}%
      </span>

      {/* Down Button with Orange Circular Progress Ring */}
      <button
        type="button"
        onClick={() => scrollStep('down')}
        aria-label="Descer secção"
        title="Descer"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#F36B21] transition-transform hover:scale-105 cursor-pointer"
      >
        <svg className="absolute inset-0 h-9 w-9 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke="rgba(243, 107, 33, 0.18)"
            strokeWidth="2.5"
          />
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke="#F36B21"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-[stroke-dashoffset] duration-150 ease-out"
          />
        </svg>
        <ChevronDown className="relative h-4 w-4 stroke-[2.5]" />
      </button>
    </div>
  )
}
