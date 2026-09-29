import { BOT_HANDLE } from '../lib/constants'

export default function Privacy() {
  return (
    <section id="privacy" className="product-tile product-tile-dark relative">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2>
            صادقانه: <span className="text-primary-emphasis">چه می‌شود، چه نمی‌شود</span>
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-on-dark-muted">
            نه «۱۰۰٪ خصوصی»، نه «دقت ٪»، نه «نامحدود».
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {/* What is sent */}
          <div className="hover-lift store-utility-card surface-card rounded-18 p-6 sm:p-7">
            <h3 className="font-display text-[16px]">چه چیزی کجا می‌رود</h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-7">
              <li className="flex gap-2">
                <span className="mt-3 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-on-dark">صدا و ویدیو ← سرویس گفتار خارجی (<bdi dir="ltr" lang="en">Speechmatics</bdi> یا <bdi dir="ltr" lang="en">Deepgram</bdi>).</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-3 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-on-dark">رونوشت و متن اسلایدها ← سرویس ساخت جزوه (<bdi dir="ltr" lang="en">Gemini / Anthropic / OpenAI-compatible</bdi>).</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-3 h-1.5 w-1.5 rounded-full bg-white/30 shrink-0" />
                <span className="text-on-dark-muted">پس داده از سرور خارج می‌شود؛ سیاست نگهداری ارائه‌دهنده را بررسی کن.</span>
              </li>
            </ul>
          </div>

          {/* What is stored / deleted */}
          <div className="hover-lift store-utility-card surface-card rounded-18 p-6 sm:p-7">
            <h3 className="font-display text-[16px]">نگهداری و حذف</h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-7">
              <li className="flex gap-2">
                <span className="mt-3 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-on-dark">فایل‌های موقت بعد از پردازش حذف می‌شوند.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-3 h-1.5 w-1.5 rounded-full bg-white/30 shrink-0" />
                <span className="text-on-dark-muted">رونوشت و جزوه ممکن است در دیتابیس محلی بماند.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-3 h-1.5 w-1.5 rounded-full bg-white/30 shrink-0" />
                <span className="text-on-dark-muted">فرم سایت فقط ایمیل و بخش فرم را با IP ذخیره می‌کند؛ ایمیلی ارسال نمی‌شود.</span>
              </li>
            </ul>
          </div>

          {/* Limits */}
          <div className="hover-lift store-utility-card surface-card rounded-18 p-6 sm:p-7">
            <h3 className="font-display text-[16px]">محدودیت‌ها</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3">
                <p className="text-xs text-on-dark-subtle">حداکثر حجم</p>
                <p className="mt-1 font-display text-[18px] persian-digits text-on-dark">۲ گیگابایت</p>
              </div>
              <div className="rounded-xl bg-surface-dark border border-subtle px-4 py-3">
                <p className="text-xs text-on-dark-subtle">مردود</p>
                <p className="mt-1 font-semibold text-on-dark"><bdi dir="ltr" lang="en">PDF / تصویر / ZIP</bdi></p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-on-dark-subtle">
              پاورپوینت: <bdi dir="ltr" lang="en">PPTX/PPSX/POTX</bdi> مستقیم؛ <bdi dir="ltr" lang="en">PPT/ODP</bdi> قدیمی با <bdi dir="ltr" lang="en">LibreOffice</bdi>.
            </p>
          </div>

          {/* Accuracy */}
          <div className="hover-lift store-utility-card surface-card rounded-18 p-6 sm:p-7">
            <h3 className="font-display text-[16px]">دقت</h3>
            <p className="mt-3 text-sm leading-7 text-on-dark">
              به کیفیت ضبط، نویز و اصطلاحات تخصصی بستگی دارد — <span className="font-semibold">هیچ تضمین ٪ نداریم</span>.
            </p>
            <p className="mt-3 text-xs leading-6 text-on-dark-subtle">
              برای ارزیابی واقعی، یک فایل را با هر دو موتور تست کن و اصطلاحات را دستی چک کن.
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs leading-6 text-on-dark-subtle">
          سؤالی درباره‌ی داده‌ات داری؟ در تلگرام از <bdi dir="ltr">{BOT_HANDLE}</bdi> بپرس.
        </p>
      </div>
    </section>
  )
}
