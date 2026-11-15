/** Original, CSS-rendered study sheets. Decorative: the adjacent copy explains the workflow. */
export default function StudyArtwork({ variant = 'notes' }) {
  if (variant === 'privacy') return (
    <div className="privacy-ledger" aria-hidden="true">
      <div className="privacy-ledger-header">
        <span className="ledger-index">یادداشت حریم خصوصی</span>
        <span className="ledger-edition">۰۱ / ۰۲</span>
      </div>
      <strong className="privacy-ledger-title">چرخه‌ی داده</strong>
      <div className="privacy-ledger-rows">
        <div className="privacy-ledger-row">
          <span className="ledger-row-number">۰۱</span>
          <div className="ledger-row-copy">
            <strong>فایل کاری</strong>
            <span className="ledger-row-state ledger-row-state-temporary">پس از پردازش پاک می‌شود</span>
          </div>
        </div>
        <div className="privacy-ledger-row">
          <span className="ledger-row-number">۰۲</span>
          <div className="ledger-row-copy">
            <strong>رونوشت و جزوه</strong>
            <span className="ledger-row-state ledger-row-state-retained">نگه‌داری؛ حذف خودکار تعریف نشده</span>
          </div>
        </div>
      </div>
      <span className="ledger-bottom">فایل ورودی ≠ متن خروجی</span>
    </div>
  )
  if (variant === 'process') return (
    <div className="process-art" aria-hidden="true">
      <span className="ledger-index">مسیر یک فایل آموزشی</span>
      <div className="process-art-row"><span>۰۱</span><strong>گفتار</strong><span>فایل کلاس</span></div>
      <span className="process-arrow">↓</span>
      <div className="process-art-row"><span>۰۲</span><strong>نوشتار</strong><span>رونوشت فارسی</span></div>
      <span className="process-arrow">↓</span>
      <div className="process-art-row"><span>۰۳</span><strong>مرور</strong><span>جزوه، در صورت موفقیت</span></div>
      <span className="ledger-bottom">نمایش مفهومی روند کار</span>
    </div>
  )
  const titles = { notes: <>از دلِ گفتار،<br />نکته‌ها می‌مانند.</>, story: <>در لحظه، گوش بده.<br />بعداً، برگرد.</>, process: <>فایل را بفرست.<br />متن را بگیر.</>, formats: <>پراکنده می‌آیند.<br />مرتب می‌مانند.</>, privacy: <>پیش از ارسال،<br />آگاهانه انتخاب کن.</> }
  return (
    <div className={`study-art study-art-${variant}`} aria-hidden="true">
      <div className="study-orbit" />
      {variant === 'notes' && <div className="study-sheet sheet-middle" />}
      <div className="study-sheet sheet-back"><span>گاماس / یادگیری</span><div className="sheet-rules" /></div>
      <div className="study-sheet sheet-front">
        <div className="sheet-meta"><span>یادداشت‌های کلاس</span><span>۰۱ — گاماس</span></div>
        <div className="sheet-title">{titles[variant] || titles.notes}</div>
        <div className="sheet-divider" />
        <div className="sheet-wave">{Array.from({ length: 35 }, (_, i) => <i key={i} data-height={(i * 7 % 5) + 1} />)}</div>
        <div className="sheet-subtitle">موضوع‌ها، تعریف‌ها، نکته‌ها</div>
        <div className="sheet-rules" />
        <div className="sheet-footer"><span>نمونه‌ی مفهومی، نه خروجی واقعی</span><span>↙</span></div>
      </div>
      <div className="study-stamp">صدا<br /><span>به نوشتار</span></div>
      <div className="art-coordinate">گفتار ← متن ← مرور</div>
    </div>
  )
}
