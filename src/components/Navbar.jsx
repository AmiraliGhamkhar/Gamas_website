import { useEffect, useRef, useState } from 'react'
import { tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'

const navLinks = [
  { href: '#how', label: 'چطور کار می‌کند' },
  { href: '#features', label: 'فرمت‌ها' },
  { href: '#privacy', label: 'حریم خصوصی' },
  { href: '#faq', label: 'پرسش‌ها' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const toggleButtonRef = useRef(null)
  const drawerRef = useRef(null)

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.matchMedia('(min-width: 834px)').matches) setOpen(false)
    }
    window.addEventListener('resize', closeOnDesktop)
    return () => window.removeEventListener('resize', closeOnDesktop)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const getFocusable = () => drawerRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    requestAnimationFrame(() => getFocusable()?.[0]?.focus())

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleButtonRef.current?.focus({ preventScroll: true })
        return
      }
      if (event.key !== 'Tab') return
      const focusable = getFocusable()
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || !drawerRef.current.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !drawerRef.current.contains(document.activeElement))) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const closeDrawer = () => {
    setOpen(false)
    toggleButtonRef.current?.focus({ preventScroll: true })
  }

  return (
    <header className="global-nav sticky top-0 z-40">
      <div className="mx-auto flex h-16 w-full max-w-content items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex min-h-11 items-center gap-2.5" aria-label="گاماس — صفحه اصلی">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink font-display text-sm leading-none text-canvas">گ</span>
          <span className="text-[17px] font-semibold">گاماس</span>
          <bdi dir="ltr" lang="en" className="hidden text-xs text-ink-subtle sm:inline">Gamas Bot</bdi>
        </a>

        <nav aria-label="ناوبری اصلی" className="hidden items-center gap-1 text-sm md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="link-underline flex min-h-11 items-center rounded-pill px-3">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-0">
          <a
            href={tgLink('navbar')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('navbar')}
            className="button-primary hidden items-center gap-2 px-5 text-sm sm:inline-flex"
          >
            شروع در تلگرام
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl shrink-0">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <button
            ref={toggleButtonRef}
            type="button"
            aria-label={open ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-11 border border-subtle bg-surface md:hidden"
          >
            <span className="sr-only">منو</span>
            <span className="flex w-4 flex-col gap-1" aria-hidden="true">
              <span className={`h-0.5 w-full rounded-full bg-ink transition-transform ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`h-0.5 w-full rounded-full bg-ink transition-opacity ${open ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`h-0.5 w-full rounded-full bg-ink transition-transform ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      <nav
        ref={drawerRef}
        id="mobile-nav"
        aria-label="منوی اصلی موبایل"
        aria-hidden={!open}
        className={`mobile-drawer md:hidden ${open ? 'is-open' : ''}`}
      >
        <div className="space-y-1 px-4 py-4 sm:px-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              tabIndex={open ? 0 : -1}
              onClick={closeDrawer}
              className="flex min-h-11 items-center justify-between rounded-11 px-4 py-3 text-sm"
            >
              {link.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl opacity-60">
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
              closeDrawer()
              trackCTA('navbar')
            }}
            className="button-primary mt-3 w-full items-center justify-center gap-2 px-5 py-3 text-sm"
          >
            شروع در تلگرام
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  )
}
