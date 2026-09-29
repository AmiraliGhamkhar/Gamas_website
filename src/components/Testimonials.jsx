import { useEffect, useRef } from 'react'

const placeholders = [
  { name: 'TODO — دانشجوی مهندسی', role: 'TODO placeholder', text: 'TODO placeholder — متن نظر کاربر در نسخه‌ی بعدی اضافه می‌شود. این کارت صرفاً برای نمایش چیدمان است و نظر واقعی نیست.' },
  { name: 'TODO — دانشجوی پزشکی', role: 'TODO placeholder', text: 'TODO placeholder — متن نظر کاربر در نسخه‌ی بعدی اضافه می‌شود. هیچ نقل‌قول واقعی فعلاً نمایش داده نمی‌شود.' },
  { name: 'TODO — دانشجوی ارشد', role: 'TODO placeholder', text: 'TODO placeholder — متن نظر کاربر در نسخه‌ی بعدی اضافه می‌شود. از نمایش نظر ساختگی خودداری شده است.' },
]

export default function Testimonials() {
  const ref = useRef(null)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let mm
    let ctx
    let cancelled = false
    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        mm = gsap.matchMedia()
        mm.add('(min-width: 768px)', () => {
          gsap.fromTo('.testi-card', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: ref.current, start: 'top 80%' } })
        })
        mm.add('(max-width: 767px)', () => {
          gsap.utils.toArray('.testi-card').forEach(el => {
            gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, scrollTrigger: { trigger: el, start: 'top 92%' } })
          })
        })
      }, ref)
    })()
    return () => {
      cancelled = true
      mm?.revert()
      ctx?.revert()
    }
  }, [])

  return (
    <section ref={ref} id="testimonials" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 glass rounded-pill px-3 py-1.5 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            نظرات — <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-300 text-[10px]">TODO placeholder</span>
          </span>
          <h2 className="mt-4 font-display text-[1.9rem] sm:text-[2.3rem] leading-[1.05] tracking-tight">
            نظر کاربران <span className="text-white/30">— به‌زودی</span>
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/50">
            این بخش فعلاً TODO است. برای صداقت، هیچ نظر ساختگی نمایش داده نمی‌شود. پس از جمع‌آوری بازخورد واقعی، اینجا به‌روزرسانی خواهد شد.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {placeholders.map((p, i) => (
            <div key={i} className="testi-card relative glass rounded-[1.4rem] p-6 will-change-transform">
              <div className="absolute top-4 end-4 rounded-full bg-amber-500/15 border border-amber-500/20 px-2 py-1 text-[10px] text-amber-300">
                TODO
              </div>
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-xs text-white/40">TODO</span>
                <div>
                  <p className="text-sm font-medium text-white/70">{p.name}</p>
                  <p className="text-xs text-white/30">{p.role}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-1" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className="h-3 w-3 rounded-full bg-white/8 border border-white/10" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-white/35">{p.text}</p>
              <p className="mt-4 text-[11px] text-white/20">این یک placeholder است — نظر واقعی نیست</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
