import React, { useEffect, useRef, useState } from 'react'

interface RevealProps {
  children: React.ReactNode
  className?: string
  delayMs?: number
  direction?: 'up' | 'down' | 'none'
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delayMs = 0,
  direction = 'up',
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const hiddenTransform =
    direction === 'up'
      ? 'translate-y-7'
      : direction === 'down'
      ? '-translate-y-7'
      : 'translate-y-0'

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
        visible
          ? 'opacity-100 translate-y-0 blur-0'
          : `opacity-0 ${hiddenTransform} blur-[3px]`
      } ${className}`}
    >
      {children}
    </div>
  )
}
