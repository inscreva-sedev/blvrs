import React, { useEffect, useState } from 'react'

export const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      if (docHeight <= 0) {
        setProgress(0)
        return
      }
      setProgress(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)))
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-[#F36B21] via-[#ff9457] to-[#F36B21] shadow-[0_0_8px_rgba(243,107,33,0.75)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
