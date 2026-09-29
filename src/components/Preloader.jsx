import { useEffect, useState } from 'react'

export default function Preloader() {
  const [phase, setPhase] = useState('hidden') // 'visible' | 'fading' | 'hidden'

  useEffect(() => {
    // never block LCP during SSR — default hidden, then decide in client
    if (typeof window === 'undefined') return

    // honor prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('hidden')
      return
    }

    let seen = null
    try {
      seen = sessionStorage.getItem('gamas_preloader_seen')
    } catch {}
    if (seen) {
      setPhase('hidden')
      return
    }

    setPhase('visible')
    // visible ≤700ms, fade 400ms → total ≤1.1s, spec says ≤1s visible
    const t1 = setTimeout(() => setPhase('fading'), 650)
    const t2 = setTimeout(() => {
      setPhase('hidden')
      try { sessionStorage.setItem('gamas_preloader_seen', '1') } catch {}
    }, 1000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (phase === 'hidden') return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="در حال بارگذاری گاماس"
      aria-hidden={phase === 'hidden' ? true : undefined}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-bg transition-opacity duration-400 ease-out will-change-[opacity] ${
        phase === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ background: '#0A0A0F' }}
    >
      {/* subtle mesh glow behind */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-[80px]" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/10 blur-[80px]" />
      </div>

      <div className="relative flex flex-col items-center gap-5">
        <div className="h-14 w-14 rounded-2xl bg-gradient-primary glow flex items-center justify-center text-[22px] font-display leading-none select-none">
          گ
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="font-display text-[15px] tracking-tight">گاماس</p>
          <p className="text-xs text-white/50">صوت کلاس → جزوه ساختاریافته</p>
        </div>

        <div className="h-1 w-24 overflow-hidden rounded-full bg-white/10 mt-1">
          <div
            className="h-full bg-gradient-primary will-change-transform"
            style={{
              width: '42%',
              animation: phase === 'visible' ? 'shimmer 1s ease-in-out infinite' : 'none',
              transform: 'translateX(-100%)'
            }}
          />
        </div>

        <span className="sr-only">در حال بارگذاری…</span>
      </div>
    </div>
  )
}
