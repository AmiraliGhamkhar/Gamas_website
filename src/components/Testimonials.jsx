export default function Testimonials() {
  return (
    <section id="testimonials" className="product-tile product-tile-parchment relative py-16 sm:py-20">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 surface-card rounded-pill px-3 py-1.5 text-xs text-white/70 chip">
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            بازخورد کاربران
          </span>
          <h2 className="mt-4 font-display text-[1.9rem] sm:text-[2.3rem] leading-[1.05] ">
            تجربه واقعی، بدون نظر ساختگی
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/50">
            هنوز بازخوردی برای انتشار نداریم. اگر کاربران تجربه‌شان را با اجازه انتشار در اختیارمان بگذارند، این بخش با نظرهای واقعی به‌روزرسانی می‌شود.
          </p>
        </div>

        <div className="store-utility-card mt-10 mx-auto max-w-2xl rounded-18 border border-white/5 bg-white/[0.02] px-6 py-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/50" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M7 8.5h10M7 12h6m-8 7 2.5-3H17a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v9a3 3 0 0 0 1 2.3V19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="mt-4 text-sm font-semibold text-white/75">هنوز نظری برای نمایش وجود ندارد</p>
          <p className="mt-2 text-xs leading-6 text-white/40">برای حفظ شفافیت، امتیاز یا نقل‌قولی تا زمان دریافت بازخورد واقعی نمایش داده نمی‌شود.</p>
        </div>
      </div>
    </section>
  )
}
