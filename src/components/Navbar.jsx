import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'

const navLinks = [
  { href: '#how', label: 'چطور کار می‌کند' },
  { href: '#features', label: 'قابلیت‌ها' },
  { href: '#privacy', label: 'حریم خصوصی' },
  { href: '#faq', label: 'پرسش‌های رایج' },
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
    const focusFrame = window.requestAnimationFrame(() => {
      drawerRef.current?.querySelector('a[href]')?.focus()
    })

    const getFocusable = () => drawerRef.current?.querySelectorAll(
      'a[href]:not([tabindex="-1"]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
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
      window.cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const closeDrawer = () => {
    setOpen(false)
    toggleButtonRef.current?.focus({ preventScroll: true })
  }

  const handleTelegramClick = () => {
    closeDrawer()
    trackCTA('navbar')
  }

  return (
    <header className="global-nav">
      <div className="container nav-inner">
        <a href="#top" className="brand-link" aria-label="گاماس — صفحه‌ی اصلی">
          <span className="brand-mark">گ</span>
          <span className="brand-name">گاماس</span>
        </a>

        <nav aria-label="ناوبری اصلی" className="desktop-nav">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">{link.label}</a>
          ))}
        </nav>

        <div className="nav-actions">
          <a
            href={tgLink('navbar')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('navbar')}
            className="button-primary nav-cta"
          >
            باز کردن ربات تلگرام
            <Icon name="arrow-left" size={16} />
          </a>
          <button
            ref={toggleButtonRef}
            type="button"
            aria-label={open ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className={`mobile-menu-toggle ${open ? 'is-open' : ''}`}
          >
            <span className="sr-only">منو</span>
            <span className="hamburger-lines" aria-hidden="true">
              <span /><span /><span />
            </span>
          </button>
        </div>
      </div>

      <nav
        ref={drawerRef}
        id="mobile-nav"
        aria-label="منوی اصلی موبایل"
        aria-hidden={!open}
        className={`mobile-drawer ${open ? 'is-open' : ''}`}
      >
        <div className="mobile-drawer-inner">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              tabIndex={open ? 0 : -1}
              onClick={closeDrawer}
              className="mobile-nav-link"
            >
              {link.label}<Icon name="arrow-left" size={17} />
            </a>
          ))}
          <a
            href={tgLink('navbar')}
            tabIndex={open ? 0 : -1}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleTelegramClick}
            className="button-primary mobile-drawer-cta"
          >
            <Icon name="telegram" size={19} />
            باز کردن ربات تلگرام
            <Icon name="arrow-left" size={17} />
          </a>
        </div>
      </nav>
    </header>
  )
}
