import { useEffect, useRef } from 'react'
import { BOT_HANDLE, tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'

export default function FinalCTA() {
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
        mm.add('(min-width: 834px)', () => {
          gsap.fromTo('.cta-card', { opacity: 0, y: 16, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: ref.current, start: 'top 85%' } })
        })
        mm.add('(max-width: 833px)', () => {
          gsap.fromTo('.cta-card', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, scrollTrigger: { trigger: ref.current, start: 'top 92%' } })
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
    <section ref={ref} id="final-cta" className="product-tile product-tile-dark relative py-16 sm:py-24">
      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="cta-card store-utility-card relative overflow-hidden surface-card rounded-18 p-8 sm:p-10 lg:p-12 will-change-transform">

          <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div className="text-center lg:text-start">
              <span className="inline-flex items-center gap-2 surface-card rounded-pill px-3 py-1.5 text-xs text-white/70 chip">
                <span className="h-1.5 w-1.5 rounded-full bg-surface-muted animate-pulse" />
                همین حالا امتحان کن
              </span>
              <h2 className="mt-4 font-display text-[1.9rem] sm:text-[2.6rem] leading-[1.05] ">
                جزوه‌ات را در <span className="text-primary-emphasis">چند دقیقه</span> بگیر
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/60">
                ویس، ویدیو یا پاورپوینت را به <bdi dir="ltr" className="text-white">{BOT_HANDLE}</bdi> بفرست — بدون نصب، با پیام وضعیت زنده و تحویل رونوشت حتی در خطا.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <a
                  href={tgLink('final_cta')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCTA('final_cta')}
                  className="button-primary inline-flex items-center justify-center gap-2 rounded-pill bg-primary px-7 py-3.5 text-[15px] font-semibold text-white hover:opacity-95 transition"
                >
                  شروع در تلگرام
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a
                  href="#how"
                  className="button-secondary-pill inline-flex items-center justify-center rounded-pill surface-card px-7 py-3.5 text-sm hover:bg-white/[0.08] transition"
                >
                  دیدن نحوه کار
                </a>
              </div>
              <p className="mt-4 text-xs text-white/30">بدون نیاز به نصب • پاسخ در چند دقیقه • حد ۲ گیگابایت</p>
            </div>

            <div className="relative">
              <div className="surface-card rounded-2xl p-5">
                <p className="text-sm font-semibold">چه می‌فرستی؟</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  {[
                    ['♫', 'وویس/صدا'],
                    ['▶', 'ویدیو'],
                    ['▭', 'پاورپوینت'],
                  ].map(([icon, label]) => (
                    <div key={label} className="rounded-xl bg-white/[0.03] border border-white/5 px-3 py-3">
                      <span className="flex h-8 w-8 mx-auto items-center justify-center rounded-full bg-primary text-sm">{icon}</span>
                      <span className="mt-2 block text-white/70">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl bg-surface-muted border border-subtle px-3 py-2.5 text-xs leading-5 text-muted">
                  ✓ یک پیام وضعیت با نوار پیشرفت — ویرایش زنده، بدون اسپم
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
