import { useCallback, useEffect, useState } from 'react'

const LEAD_API = '/api/lead.php'

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
      setMsg('ایمیل نامعتبر است.')
      return
    }
    setStatus('loading')
    setMsg('')

    // The token is issued on mount; if that request failed (cold cache,
    // transient 429, blocked cookie) fetch a fresh one instead of failing.
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
      setMsg('اتصال امن برقرار نشد. صفحه را رفرش کنید.')
      return
    }

    try {
      const res = await fetch(LEAD_API, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': token,
        },
        body: JSON.stringify({ email: trimmed, csrf_token: token, website: honeypot, source }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && (data.ok || data.csrf_token)) {
        setStatus('success')
        setMsg(data.message || 'ایمیل ثبت شد. به‌زودی خبر می‌دهیم.')
        setEmail('')
      } else if (res.status === 429) {
        setStatus('error')
        setMsg(data.message || 'تعداد درخواست زیاد است. یک ساعت بعد تلاش کنید.')
      } else {
        setStatus('error')
        setMsg(data.message || 'خطایی رخ داد. دوباره تلاش کنید.')
      }
    } catch {
      setStatus('error')
      setMsg('خطای شبکه. اتصال را بررسی کنید.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-3" noValidate>
      {/* Honeypot — hidden for humans, trap for bots */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
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

      <div className="flex flex-col sm:flex-row gap-2">
        <label htmlFor={`email-${source}`} className="sr-only">ایمیل</label>
        <input
          id={`email-${source}`}
          type="email"
          inputMode="email"
          dir="ltr"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 rounded-pill border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="inline-flex items-center justify-center gap-2 rounded-pill bg-gradient-primary px-6 py-3 text-sm font-medium text-white shadow-glow hover:opacity-95 disabled:opacity-50 transition will-change-transform"
        >
          {status === 'loading' ? 'در حال ارسال…' : status === 'success' ? '✓ ثبت شد' : 'ثبت ایمیل'}
        </button>
      </div>

      {/* CSRF hidden */}
      <input type="hidden" name="csrf_token" value={csrf} />

      {msg && (
        <p
          role={status === 'error' ? 'alert' : 'status'}
          className={`rounded-xl px-3 py-2 text-xs leading-5 ${
            status === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/15 text-emerald-200'
              : status === 'error'
                ? 'bg-red-500/10 border border-red-500/15 text-red-200'
                : 'bg-white/5 border border-white/10 text-white/60'
          }`}
        >
          {msg}
        </p>
      )}

      <p className="text-[11px] leading-4 text-white/30">
        با ثبت ایمیل، با ارسال صدا/رونوشت به سرویس‌های STT/LLM خارجی موافقت می‌کنید. جزئیات در <a href="#privacy" className="underline hover:text-white/50">حریم خصوصی</a>.
      </p>
    </form>
  )
}
