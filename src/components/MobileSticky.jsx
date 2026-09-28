import { tgLink } from '../lib/constants'

export default function MobileSticky() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-30 border-t border-white/10 bg-[#0A0A0F]/85 backdrop-blur-[16px] supports-[backdrop-filter]:bg-[#0A0A0F]/70 p-3 sm:hidden safe-pb">
      <a
        href={tgLink('mobile_sticky')}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-pill bg-gradient-primary py-3 text-[14px] font-medium text-white shadow-glow active:opacity-90 transition"
      >
        شروع در تلگرام — رایگان امتحان کن
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl">
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  )
}
