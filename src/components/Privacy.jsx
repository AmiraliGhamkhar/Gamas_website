import { useEffect, useRef } from 'react'

export default function Privacy() {
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
          gsap.fromTo('.privacy-card', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: ref.current, start: 'top 78%' } })
        })
        mm.add('(max-width: 833px)', () => {
          gsap.utils.toArray('.privacy-card').forEach(el => {
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
    <section ref={ref} id="privacy" className="product-tile product-tile-dark relative py-16 sm:py-20">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 surface-card rounded-pill px-3 py-1.5 text-xs text-white/70 chip">
            <span className="h-1.5 w-1.5 rounded-full bg-surface-muted" />
            حریم خصوصی و محدودیت‌ها — صادقانه
          </span>
          <h2 className="mt-4 font-display text-[1.9rem] sm:text-[2.45rem] leading-[1.05] ">
            صادقانه: <span className="text-primary-emphasis">چه می‌شود، چه نمی‌شود</span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/60">
            گاماس روی صداقت ساخته شده — نه «۱۰۰٪ خصوصی»، نه «دقت ٪»، نه «نامحدود». اینجا دقیقاً می‌گوییم چه به کجا می‌رود و چه محدودیت‌هایی وجود دارد.
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* What is sent */}
          <div className="privacy-card store-utility-card surface-card rounded-18 p-6 sm:p-7 will-change-transform">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-xl bg-surface-muted border border-subtle flex items-center justify-center text-muted text-sm">↗</span>
              <h3 className="font-display text-[15px]">چه چیزی به کجا ارسال می‌شود</h3>
            </div>
            <p className="mt-3 text-sm leading-7 text-white/60">
              برای پردازش، فایل‌ها و رونوشت‌ها به ارائه‌دهندگان خارجی ارسال می‌شوند — <span className="text-white">نمی‌توانیم بگوییم ۱۰۰٪ خصوصی است</span>.
            </p>
            <ul className="mt-4 space-y-2.5 text-sm leading-6">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-surface-muted shrink-0" />
                <span className="text-white/70"><span className="text-white">صدا / ویدیو / صدای استخراج‌شده از پاورپوینت</span> ← به سرویس <bdi dir="ltr" lang="en">STT</bdi> خارجی (<bdi dir="ltr" lang="en">Speechmatics</bdi> یا <bdi dir="ltr" lang="en">Deepgram</bdi>) برای تبدیل گفتار فارسی.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-surface-muted shrink-0" />
                <span className="text-white/70"><span className="text-white">رونوشت + متن اسلایدها + یادداشت گوینده</span> ← در صورت فعال بودن، به سرویس ساخت جزوه (<bdi dir="ltr" lang="en">Gemini / Anthropic / OpenAI-compatible</bdi>) ارسال می‌شود.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-white/40 shrink-0" />
                <span className="text-white/60">انتخاب ارائه‌دهنده و سیاست نگهداری داده‌ی آن‌ها را قبل از استفاده در تولید بررسی کنید — مقررات حریم خصوصی، رضایت کاربر و محل نگهداری داده مهم است.</span>
              </li>
            </ul>
            <div className="mt-5 rounded-xl bg-surface-muted border border-subtle px-3 py-2.5 text-xs leading-5 text-muted">
              ⚠️ بدون ادعای «کاملاً خصوصی» — هر جا <bdi dir="ltr" lang="en">STT/LLM</bdi> خارجی در میان است، داده از سرور شما خارج می‌شود.
            </div>
          </div>

          {/* What is stored / deleted */}
          <div className="privacy-card store-utility-card surface-card rounded-18 p-6 sm:p-7 will-change-transform">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-xl bg-surface-muted border border-subtle flex items-center justify-center text-muted text-sm">◧</span>
              <h3 className="font-display text-[15px]">نگهداری و حذف</h3>
            </div>
            <ul className="mt-3 space-y-2.5 text-sm leading-6">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-surface-muted shrink-0" />
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
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-white/40 shrink-0" />
                <span className="text-white/60">در فرم همین وب‌سایت، ایمیل، بخش فرم، IP و مشخصات مرورگر برای مدیریت فهرست دسترسی ذخیره می‌شود؛ ایمیل خودکار ارسال نمی‌شود. کلیک‌های CTA فقط با نام بخش و زمان ثبت می‌شوند (۹۰ روز در SQLite یا حداکثر ۱ مگابایت در حالت فایل).</span>
              </li>
            </ul>
            <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2.5">
                <p className="text-white/40">حذف خودکار</p>
                <p className="mt-1 font-semibold text-white/80">فایل موقت ← حذف</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2.5">
                <p className="text-white/40">ماندگار (قابل تنظیم)</p>
                <p className="mt-1 font-semibold text-white/80">DB محلی ← رونوشت/جزوه</p>
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="privacy-card store-utility-card surface-card rounded-18 p-6 sm:p-7 will-change-transform">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-xl bg-surface-muted border border-subtle flex items-center justify-center text-muted text-sm">⧉</span>
              <h3 className="font-display text-[15px]">محدودیت‌ها — شفاف</h3>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                <p className="text-xs text-white/40">حداکثر حجم</p>
                <p className="mt-1 font-display text-[18px] persian-digits">۲ گیگابایت</p>
                <p className="mt-1 text-xs text-white/35">بزرگ‌تر مردود</p>
              </div>
              <div className="rounded-xl bg-surface-muted border border-subtle px-4 py-3">
                <p className="text-xs text-muted">مردود</p>
                <p className="mt-1 font-semibold text-muted"><bdi dir="ltr" lang="en">PDF / تصویر / ZIP</bdi></p>
                <p className="mt-1 text-xs text-muted">پشتیبانی نمی‌شود</p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-white/45">
              پاورپوینت: <bdi dir="ltr" lang="en">PPTX/PPSX/POTX</bdi> به‌صورت <bdi dir="ltr" lang="en">native</bdi>؛ <bdi dir="ltr" lang="en">PPT/PPS/POT/ODP/OTP</bdi> قدیمی فقط با <bdi dir="ltr" lang="en">LibreOffice</bdi> قابل تبدیل است.
            </p>
          </div>

          {/* Accuracy */}
          <div className="privacy-card store-utility-card surface-card rounded-18 p-6 sm:p-7 will-change-transform">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-xl bg-surface-muted border border-subtle flex items-center justify-center text-muted text-sm">≈</span>
              <h3 className="font-display text-[15px]">دقت — متغیر، بدون ادعای ٪</h3>
            </div>
            <p className="mt-3 text-sm leading-7 text-white/60">
              دقت <bdi dir="ltr" lang="en">STT</bdi> فارسی به کیفیت ضبط، میکروفون، نویز، گویش و اصطلاحات تخصصی (پزشکی/مهندسی) وابسته است — <span className="text-white">هیچ تضمین ٪ نداریم</span>.
            </p>
            <p className="mt-3 text-xs leading-5 text-white/35">
              برای ارزیابی واقعی، یک فایل را با هر دو موتور (<bdi dir="ltr" lang="en">Speechmatics/Deepgram</bdi>) تست و اصطلاحات را دستی بررسی کنید. منبع: README بات.
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
