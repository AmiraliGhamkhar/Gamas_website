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
    fetchToken().catch(() => {})
  }, [fetchToken])

  async function onSubmit(e) {
    e.preventDefault()
    if (status === 'loading') return
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error')
      setMsg('ایمیل را درست وارد کنید.')
      return
    }
    setStatus('loading')
    setMsg('')

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
      setMsg('امکان اتصال امن نبود؛ صفحه را تازه کنید.')
      return
    }

    try {
      const res = await fetch(LEAD_API, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          'X-CSRF-Token': token,
        },
        body: JSON.stringify({ email: trimmed, csrf_token: token, website: honeypot, source }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && (data.ok || data.csrf_token)) {
        setStatus('success')
        setMsg('درخواست ثبت شد؛ ایمیل خودکار ارسال نمی‌شود.')
        setEmail('')
      } else if (res.status === 429) {
        setStatus('error')
        setMsg('کمی بعد دوباره تلاش کنید.')
      } else {
        if (res.status === 403) {
          setCsrf('')
          fetchToken().catch(() => {})
        }
        setStatus('error')
        setMsg('درخواست ثبت نشد؛ دوباره تلاش کنید.')
      }
    } catch {
      setStatus('error')
      setMsg('ارتباط با سرور برقرار نشد؛ اتصال خود را بررسی کنید.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="lead-form" noValidate aria-busy={status === 'loading'}>
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

      <div className="lead-field">
        <label htmlFor={`email-${source}`}>ایمیل برای درخواست دسترسی</label>
        <div className="lead-field-row">
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
          />
          <button type="submit" disabled={status === 'loading' || status === 'success'} className="button-primary lead-submit">
            {status === 'loading' ? 'در حال ثبت…' : status === 'success' ? 'ثبت شد' : 'ثبت ایمیل'}
          </button>
        </div>
      </div>

      <input type="hidden" name="csrf_token" value={csrf} />

      <p
        id={`email-message-${source}`}
        role={status === 'error' ? 'alert' : 'status'}
        aria-live={status === 'error' ? 'assertive' : 'polite'}
        className={`lead-status ${msg ? '' : 'sr-only'}`}
      >
        {msg}
      </p>

      <p className="lead-privacy-note">
        ایمیل فقط برای مدیریت فهرست دسترسی ذخیره می‌شود؛ ایمیل خودکار ارسال نمی‌شود.{' '}
        <a href="#privacy" className="inline-link">جزئیات</a>
      </p>
    </form>
  )
}
