export default function Testimonials() {
  return (
    <section id="testimonials" className="product-tile product-tile-parchment relative">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2>
            تجربه‌ی واقعی، <span className="text-primary-emphasis">بدون نظر ساختگی</span>
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-ink-muted">
            هنوز بازخوردی منتشر نکرده‌ایم — با اجازه‌ی کاربران، همین‌جا می‌آید.
          </p>
        </div>

        <div className="hover-lift store-utility-card mx-auto mt-10 max-w-xl rounded-18 px-6 py-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-ink-subtle" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M7 8.5h10M7 12h6m-8 7 2.5-3H17a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v9a3 3 0 0 0 1 2.3V19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="mt-4 text-sm font-semibold">هنوز نظری نیست</p>
          <p className="mt-2 text-xs leading-6 text-ink-muted">
            تا بازخورد واقعی برسد، امتیاز و نقل‌قولی نمایش داده نمی‌شود.
          </p>
        </div>
      </div>
    </section>
  )
}
