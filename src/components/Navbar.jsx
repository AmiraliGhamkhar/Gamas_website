import { useEffect, useRef, useState } from 'react'
import { BOT_HANDLE, tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'

const navLinks = [
  { href: '#features', label: 'ویژگی‌ها' },
  { href: '#how', label: 'نحوه کار' },
  { href: '#privacy', label: 'حریم خصوصی' },
  { href: '#faq', label: 'سوالات' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleButtonRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Unlock the page when switching back to desktop while the mobile drawer is open.
  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.matchMedia('(min-width: 768px)').matches) setOpen(false)
    }
    window.addEventListener('resize', closeOnDesktop)
    return () => window.removeEventListener('resize', closeOnDesktop)
  }, [])

  // Lock background scrolling while the drawer is open and support Escape.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    if (open) document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleButtonRef.current?.focus()
      }
    }
    if (open) window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
        scrolled
          ? 'bg-[#0A0A0F]/75 backdrop-blur-[16px] border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] supports-[backdrop-filter]:bg-[#0A0A0F]/60'
          : 'bg-[#0A0A0F]/55 backdrop-blur-[16px] border-white/[0.06] supports-[backdrop-filter]:bg-[#0A0A0F]/55'
      }`}
    >
      <div className="mx-auto max-w-content w-full px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-3 group"
          aria-label="گاماس — صفحه اصلی"
        >
          <span className="h-8 w-8 rounded-xl bg-gradient-primary flex items-center justify-center font-display text-sm leading-none shadow-glow group-hover:opacity-95 transition">
            گ
          </span>
          <span className="font-display text-[17px] tracking-tight leading-none">گاماس</span>
          <span className="hidden sm:inline text-xs text-white/45 me-1">Gamas Bot</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 text-[13.5px] text-white/70 ms-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-full hover:text-white hover:bg-white/[0.06] transition"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 ms-auto md:ms-0">
          {/* Desktop CTA — also visible on >= sm, hidden on very small to keep space for hamburger */}
          <a
            href={tgLink('navbar')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('navbar')}
            className="hidden sm:inline-flex items-center gap-2 rounded-pill bg-gradient-primary px-5 py-2.5 text-[13.5px] font-medium text-white shadow-glow hover:opacity-[0.92] active:opacity-90 transition"
          >
            شروع در تلگرام
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl shrink-0">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          {/* Mobile hamburger */}
          <button
            ref={toggleButtonRef}
            type="button"
            aria-label={open ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full glass hover:bg-white/[0.08] transition"
          >
            <span className="sr-only">منو</span>
            <span className="relative block h-3.5 w-4">
              <span className={`absolute inset-x-0 h-0.5 bg-white rounded-full transition will-change-transform ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute inset-x-0 top-1.5 h-0.5 bg-white rounded-full transition ${open ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute inset-x-0 h-0.5 bg-white rounded-full transition will-change-transform ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <nav
        id="mobile-nav"
        aria-label="منوی اصلی موبایل"
        aria-hidden={!open}
        className={`md:hidden overflow-hidden border-t border-white/5 bg-[#0A0A0F]/95 backdrop-blur-[16px] transition-all duration-300 ease-out ${
          open ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-4 sm:px-6 py-4 space-y-1">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              tabIndex={open ? 0 : -1}
              onClick={() => {
                setOpen(false)
                toggleButtonRef.current?.focus({ preventScroll: true })
              }}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-white/80 hover:bg-white/[0.06] hover:text-white transition"
            >
              {l.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl opacity-50">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
          <a
            href={tgLink('navbar')}
            tabIndex={open ? 0 : -1}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setOpen(false)
              toggleButtonRef.current?.focus({ preventScroll: true })
              trackCTA('navbar')
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-pill bg-gradient-primary px-5 py-3 text-sm font-medium text-white shadow-glow"
          >
            شروع در تلگرام — {BOT_HANDLE}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p className="pt-3 text-center text-[11px] leading-4 text-white/35">
            منوی ربات: ساخت جزوه / راهنما / قالب‌ها / حریم خصوصی
          </p>
        </div>
      </nav>
    </header>
  )
}
