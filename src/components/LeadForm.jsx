import { useCallback, useEffect, useState } from 'react'
import { sitePath } from '../lib/constants'

const LEAD_API = sitePath('api/lead.php')

export default function LeadForm({ source = 'access' }) {
  const [email, setEmail] = useState('')
  const [csrf, setCsrf] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [msg, setMsg] = useState('')
  const [honeypot, setHoneypot] = useState('') // website

  const fetchToken = useCallback(async () => {
    const res = await fetch(LEAD_API, {
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return ''
    const data = await res.json().catch(() => ({}))
    const token = data && typeof data.csrf_token === 'string' ? data.csrf_token : ''
    if (token) setCsrf(token)
    return token
  }, [])

  useEffect(() => {
    // Fetch CSRF token on mount; onSubmit retries if this ever failed.
    fetchToken().catch(() => {})
  }, [fetchToken])

  async function onSubmit(e) {
    e.preventDefault()
    if (status === 'loading') return
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error')
      setMsg('نشانی ایمیل را به‌درستی وارد کنید.')
      return
    }
    setStatus('loading')
    setMsg('')

    // The token is issued on mount; onSubmit retries if that request failed.
    let token = csrf
    if (!token) {
      try {
        token = await fetchToken()
      } catch {
        token = ''
      }
    }
    if (!token) {
      setStatus('error')
      setMsg('اتصال امن برقرار نشد؛ صفحه را تازه‌سازی کنید.')
      return
    }

    try {
      const res = await fetch(LEAD_API, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'X-CSRF-Token': token,
        },
        body: JSON.stringify({ email: trimmed, csrf_token: token, website: honeypot, source }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && (data.ok || data.csrf_token)) {
        setStatus('success')
        setMsg('درخواست شما ثبت شد؛ ایمیل پیگیری خودکار ارسال نمی‌شود.')
        setEmail('')
      } else if (res.status === 429) {
        setStatus('error')
        setMsg('تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید.')
      } else {
        if (res.status === 403) {
          setCsrf('')
          fetchToken().catch(() => {})
        }
        setStatus('error')
        setMsg('ثبت درخواست انجام نشد؛ دوباره تلاش کنید.')
      }
    } catch {
      setStatus('error')
      setMsg('ارتباط با سرور برقرار نشد؛ اتصال خود را بررسی کنید.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate aria-busy={status === 'loading'}>
      {/* Honeypot — hidden for humans, trap for bots */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`website-${source}`}>وب‌سایت</label>
        <input
          id={`website-${source}`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`email-${source}`} className="text-sm font-semibold">ایمیل برای درخواست دسترسی</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id={`email-${source}`}
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading' || status === 'success'}
            aria-invalid={status === 'error'}
            aria-describedby={`email-message-${source}`}
            className="min-w-0 flex-1 rounded-11 border border-dark bg-surface-dark px-4 py-3 text-sm text-on-dark placeholder:text-on-dark-subtle focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="button-primary inline-flex items-center justify-center px-6 py-3 text-sm"
          >
            {status === 'loading' ? 'در حال ارسال…' : status === 'success' ? 'ثبت شد' : 'ثبت ایمیل'}
          </button>
        </div>
      </div>

      {/* Keep the existing CSRF field contract. */}
      <input type="hidden" name="csrf_token" value={csrf} />

      <p
        id={`email-message-${source}`}
        role={status === 'error' ? 'alert' : 'status'}
        aria-live={status === 'error' ? 'assertive' : 'polite'}
        className={`min-h-[1.6em] text-xs leading-6 text-on-dark-subtle ${msg ? '' : 'sr-only'}`}
      >
        {msg}
      </p>

      <p className="text-xs leading-6 text-on-dark-subtle">
        فقط برای مدیریت فهرست دسترسی ذخیره می‌شود؛ ایمیلی ارسال نمی‌شود.{' '}
        <a href="#privacy" className="inline-link link-underline">جزئیات</a>
      </p>
    </form>
  )
}
