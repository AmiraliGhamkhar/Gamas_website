import { useEffect, useRef } from 'react'

export default function Privacy() {
  const ref = useRef(null)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let mm
    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      const ctx = gsap.context(() => {
        mm = gsap.matchMedia()
        mm.add('(min-width: 768px)', () => {
          gsap.fromTo('.privacy-card', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: ref.current, start: 'top 78%' } })
        })
        mm.add('(max-width: 767px)', () => {
          gsap.utils.toArray('.privacy-card').forEach(el => {
            gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, scrollTrigger: { trigger: el, start: 'top 92%' } })
          })
        })
      }, ref)
      return () => ctx.revert()
    })()
    return () => mm?.revert()
  }, [])

  return (
    <section ref={ref} id="privacy" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 glass rounded-pill px-3 py-1.5 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            حریم خصوصی و محدودیت‌ها — صادقانه
          </span>
          <h2 className="mt-4 font-display text-[1.9rem] sm:text-[2.45rem] leading-[1.05] tracking-tight">
            صادقانه: <span className="text-gradient">چه می‌شود، چه نمی‌شود</span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/60">
            گاماس روی صداقت ساخته شده — نه «۱۰۰٪ خصوصی»، نه «دقت ٪»، نه «نامحدود». اینجا دقیقاً می‌گوییم چه به کجا می‌رود و چه محدودیت‌هایی وجود دارد.
          </p>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-4">
          {/* What is sent */}
          <div className="privacy-card glass rounded-[1.5rem] p-6 sm:p-7 will-change-transform">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-300 text-sm">↗</span>
              <h3 className="font-display text-[15px]">چه چیزی به کجا ارسال می‌شود</h3>
            </div>
            <p className="mt-3 text-sm leading-7 text-white/60">
              برای پردازش، فایل‌ها و رونوشت‌ها به ارائه‌دهندگان خارجی ارسال می‌شوند — <span className="text-white">نمی‌توانیم بگوییم ۱۰۰٪ خصوصی است</span>.
            </p>
            <ul className="mt-4 space-y-2.5 text-sm leading-6">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-300 shrink-0" />
                <span className="text-white/70"><span className="text-white">صدا / ویدیو / صدای استخراج‌شده از پاورپوینت</span> → به سرویس STT خارجی (Speechmatics یا Deepgram) برای تبدیل گفتار فارسی.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-300 shrink-0" />
                <span className="text-white/70"><span className="text-white">رونوشت + متن اسلایدها + یادداشت گوینده</span> → در صورت فعال بودن، به سرویس ساخت جزوه (Gemini / Anthropic / سرویس OpenAI-compatible) ارسال می‌شود.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-white/40 shrink-0" />
                <span className="text-white/60">انتخاب ارائه‌دهنده و سیاست نگهداری داده‌ی آن‌ها را قبل از استفاده در تولید بررسی کنید — مقررات حریم خصوصی، رضایت کاربر و محل نگهداری داده مهم است.</span>
              </li>
            </ul>
            <div className="mt-5 rounded-xl bg-amber-500/8 border border-amber-500/15 px-3 py-2.5 text-xs leading-5 text-amber-200/80">
              ⚠️ بدون ادعای «کاملاً خصوصی» — هر جا STT/LLM خارجی در میان است، داده از سرور شما خارج می‌شود.
            </div>
          </div>

          {/* What is stored / deleted */}
          <div className="privacy-card glass rounded-[1.5rem] p-6 sm:p-7 will-change-transform">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center text-cyan-300 text-sm">◧</span>
              <h3 className="font-display text-[15px]">نگهداری و حذف</h3>
            </div>
            <ul className="mt-3 space-y-2.5 text-sm leading-6">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-emerald-300 shrink-0" />
                <span className="text-white/70">فایل‌های موقتِ پاورپوینت و رسانه بعد از پردازش <span className="text-white">حذف</span> می‌شوند.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-white/40 shrink-0" />
                <span className="text-white/60">پایگاه‌داده‌ی محلی ممکن است حاوی: اطلاعات کاربر، وضعیت کار، رونوشت خام، جزوه‌ی تولیدشده، و فراداده‌ی پرزنتیشن/کلیپ‌ها باشد — سیاستِ نگهداری/حذفِ خود را مشخص کنید.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-white/40 shrink-0" />
                <span className="text-white/60">قبل از استقرار تولید: سیاست نگهداری ارائه‌دهندگان، رضایت، مقررات و محل داده را مرور کنید.</span>
              </li>
            </ul>
            <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2.5">
                <p className="text-white/40">حذف خودکار</p>
                <p className="mt-1 font-medium text-white/80">فایل موقت → حذف</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2.5">
                <p className="text-white/40">ماندگار (قابل تنظیم)</p>
                <p className="mt-1 font-medium text-white/80">DB محلی → رونوشت/جزوه</p>
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="privacy-card glass rounded-[1.5rem] p-6 sm:p-7 will-change-transform">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-violet-300 text-sm">⧉</span>
              <h3 className="font-display text-[15px]">محدودیت‌ها — شفاف</h3>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                <p className="text-xs text-white/40">حداکثر حجم</p>
                <p className="mt-1 font-display text-[18px] persian-digits">۲ گیگابایت</p>
                <p className="mt-1 text-xs text-white/35">بزرگ‌تر مردود</p>
              </div>
              <div className="rounded-xl bg-red-500/8 border border-red-500/15 px-4 py-3">
                <p className="text-xs text-red-300/70">مردود</p>
                <p className="mt-1 font-medium text-red-200">PDF / تصویر / ZIP</p>
                <p className="mt-1 text-xs text-red-300/50">پشتیبانی نمی‌شود</p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-white/45">
              پاورپوینت: PPTX/PPSX/POTX به‌صورت native؛ PPT/PPS/POT/ODP/OTP قدیمی فقط با LibreOffice قابل تبدیل است.
            </p>
          </div>

          {/* Accuracy */}
          <div className="privacy-card glass rounded-[1.5rem] p-6 sm:p-7 will-change-transform">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-300 text-sm">≈</span>
              <h3 className="font-display text-[15px]">دقت — متغیر، بدون ادعای ٪</h3>
            </div>
            <p className="mt-3 text-sm leading-7 text-white/60">
              دقت STT فارسی به کیفیت ضبط، میکروفون، نویز، گویش و اصطلاحات تخصصی (پزشکی/مهندسی) وابسته است — <span className="text-white">هیچ تضمین ٪ نداریم</span>.
            </p>
            <p className="mt-3 text-xs leading-5 text-white/35">
              برای ارزیابی واقعی، یک فایل را با هر دو موتور (Speechmatics/Deepgram) تست و اصطلاحات را دستی بررسی کنید. منبع: README بات.
            </p>
            <div className="mt-4 rounded-xl bg-white/[0.02] border border-white/5 px-3 py-2.5 text-xs text-white/40">
              هیچ «دقت ۹۵٪» ادعا نمی‌شود — همه‌چیز به فایل شما بستگی دارد.
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs leading-5 text-white/25">
          این بخش خلاصه‌ای صادقانه از README است — متن README را عیناً کپی نکرده‌ایم (ریپو لایسنس ندارد).
        </p>
      </div>
    </section>
  )
}
