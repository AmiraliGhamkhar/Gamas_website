import { useEffect, useRef } from 'react'
import { BOT_HANDLE, tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'
import LeadForm from './LeadForm'

export default function Access() {
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
          gsap.fromTo('.access-card', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: ref.current, start: 'top 78%' } })
        })
        mm.add('(max-width: 767px)', () => {
          gsap.utils.toArray('.access-card').forEach(el => {
            gsap.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, scrollTrigger: { trigger: el, start: 'top 92%' } })
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
    <section ref={ref} id="access" className="relative py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 start-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-r from-primary/7 via-violet-500/5 to-accent/7 blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 glass rounded-pill px-3 py-1.5 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            دسترسی و قیمت — جزئیات در حال تعیین
          </span>
          <h2 className="mt-4 font-display text-[1.9rem] sm:text-[2.45rem] leading-[1.05] tracking-tight">
            دسترسی <span className="text-gradient">فعلاً با تایید ادمین</span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/60">
            قیمت و ساختار پلن‌ها هنوز نهایی نشده‌اند. در حال حاضر دسترسی فقط پس از هماهنگی و تأیید ادمین امکان‌پذیر است.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {/* Current status */}
          <div className="access-card relative overflow-hidden glass-strong rounded-[1.4rem] p-6 will-change-transform border-emerald-500/15">
            <div className="absolute top-4 end-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-1 text-[10px] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              وضعیت فعلی
            </div>
            <h3 className="font-display text-[15px]">دسترسی با تایید ادمین</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">
              در حال حاضر ثبت‌نام عمومی باز نیست. برای فعال‌سازی با ادمین در تلگرام در ارتباط باشید.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-white/45">
              <span className="h-1 w-1 rounded-full bg-white/30" />
              بدون نیاز به کارت بانکی
            </div>
            <a href={tgLink('access')} target="_blank" rel="noopener noreferrer" onClick={() => trackCTA('access')} className="mt-4 flex w-full items-center justify-center gap-2 rounded-pill bg-white text-zinc-900 px-4 py-2.5 text-sm font-medium hover:bg-white/90 transition">
              درخواست دسترسی — {BOT_HANDLE}
            </a>
            <div className="mt-4 h-px bg-white/5" />
            <p className="mt-4 text-xs font-medium text-white/60">یا ایمیل را برای ثبت درخواست دسترسی وارد کنید:</p>
            <LeadForm source="access" />
          </div>

          <div className="access-card relative overflow-hidden glass rounded-[1.4rem] p-6 will-change-transform">
            <div className="absolute top-4 end-4 inline-flex rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] text-white/45">
              در حال بررسی
            </div>
            <h3 className="font-display text-[15px] text-white/80">ساختار پلن‌ها</h3>
            <p className="mt-2 text-sm leading-6 text-white/45">
              محدودیت‌ها و شیوه استفاده هنوز نهایی نشده‌اند. جزئیات پس از تصمیم‌گیری در همین صفحه اعلام می‌شود.
            </p>
            <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 text-center text-xs text-white/35">
              هنوز اعلام نشده
            </div>
          </div>

          <div className="access-card relative overflow-hidden glass rounded-[1.4rem] p-6 will-change-transform">
            <div className="absolute top-4 end-4 inline-flex rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] text-white/45">
              اعلام نشده
            </div>
            <h3 className="font-display text-[15px] text-white/80">قیمت‌گذاری</h3>
            <p className="mt-2 text-sm leading-6 text-white/45">
              قیمت نهایی هنوز اعلام نشده است. پیش از فعال‌سازی، شرایط دسترسی و هرگونه هزینه احتمالی را با ادمین هماهنگ کنید.
            </p>
            <div className="mt-6 rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2.5 text-center text-xs text-white/40">
              قیمت: اعلام نشده
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] leading-5 text-white/30">
          پیش از ثبت درخواست، شرایط دسترسی و هرگونه هزینه احتمالی را با ادمین هماهنگ کنید. جزئیات حریم خصوصی در بخش بعدی آمده است.
        </p>
      </div>
    </section>
  )
}
