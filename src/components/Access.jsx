import { BOT_HANDLE, tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'
import LeadForm from './LeadForm'

export default function Access() {
  return (
    <section id="access" className="product-tile product-tile-dark relative">
      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2>
            دسترسی فعلاً <span className="text-primary-emphasis">با تأیید ادمین</span>
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-on-dark-muted">
            قیمت و پلن‌ها هنوز نهایی نشده؛ فعلاً با هماهنگی.
          </p>
        </div>

        <div className="mt-10 mx-auto max-w-xl">
          <div className="hover-lift store-utility-card surface-card rounded-18 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm text-white">✉</span>
              <h3 className="font-display text-[16px]">درخواست دسترسی</h3>
            </div>
            <p className="mt-3 text-sm leading-7 text-on-dark-muted">
              در تلگرام به ادمین پیام بده، یا ایمیلت را بگذار تا دستی پیگیری کنیم.
            </p>
            <a
              href={tgLink('access')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA('access')}
              className="button-secondary-pill mt-5 flex w-full items-center justify-center gap-2 rounded-pill bg-white text-zinc-900 px-4 py-3 text-sm font-semibold"
            >
              پیام به <bdi dir="ltr">{BOT_HANDLE}</bdi>
            </a>
            <div className="mt-5 h-px bg-white/5" />
            <LeadForm source="access" />
          </div>

          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div className="hover-lift store-utility-card surface-card rounded-18 p-5 text-center">
              <p className="text-sm font-semibold text-on-dark">پلن‌ها</p>
              <p className="mt-1 text-xs text-on-dark-subtle">هنوز اعلام نشده</p>
            </div>
            <div className="hover-lift store-utility-card surface-card rounded-18 p-5 text-center">
              <p className="text-sm font-semibold text-on-dark">قیمت</p>
              <p className="mt-1 text-xs text-on-dark-subtle">هنوز اعلام نشده</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
