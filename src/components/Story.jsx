import Icon from './Icon'
import StudyArtwork from './StudyArtwork'

const outcomes = [
  { title: 'گفتار را به رونوشت فارسی تبدیل می‌کند', text: 'متنی برای خواندن دوباره و مرور نکته‌های کلاس.' },
  { title: 'نکته‌ها را برای مرور مرتب می‌کند', text: 'اگر ساخت جزوه موفق باشد، نکته‌ها و موضوع‌های درس در فایل Word کنار هم می‌آیند.' },
  { title: 'متن اسلایدها را هم به جزوه می‌افزاید', text: 'در صورت موفقیت در ساخت جزوه، متن اسلایدهای PowerPoint هم به فایل Word افزوده می‌شود.' },
]

const outcomeNumbers = ['۰۱', '۰۲', '۰۳']

export default function Story() {
  return (
    <section id="story" className="product-tile product-tile-light story-section">
      <div className="container">
        <div className="story-card">
          <div className="story-intro">
            <div className="story-heading-block">
              <p className="story-kicker">بعد از کلاس</p>
              <h2 className="section-title story-title">
                سر کلاس گوش بده؛
                <span className="story-title-accent">جزوه را بعداً مرور کن.</span>
              </h2>
            </div>
            <p className="section-description">
              جزوه‌نویسی هم‌زمان با کلاس همیشه شدنی نیست. وقتی فایل ضبط‌شده مانده و وقت گوش‌دادن دوباره نداری، گاماس گفتار را به رونوشت فارسی تبدیل می‌کند؛ اگر ساخت جزوه موفق باشد، نکته‌های درس هم برای مرور کنار هم می‌نشینند.
            </p>
          </div>

          <div className="story-benefits">
            <h3 id="story-benefits-title" className="story-benefits-title"><span aria-hidden="true">۰۳</span> سه دستاورد برای مرور</h3>
            <ul className="outcome-list" aria-labelledby="story-benefits-title">
              {outcomes.map((item, index) => (
                <li key={item.title}>
                  <span className="outcome-number" aria-hidden="true">{outcomeNumbers[index]}</span>
                  <span className="outcome-copy">
                    <strong>{item.title}</strong>
                    <small>{item.text}</small>
                  </span>
                </li>
              ))}
            </ul>

            <a href="#how" className="text-link story-link">
              مراحل کار را ببین <Icon name="arrow-left" size={18} />
            </a>
          </div>

          <figure className="story-visual">
            <StudyArtwork variant="story" />
            <figcaption className="story-visual-caption">
              <span>از شنیدن تا مرور دوباره</span>
              <small>تصویر مفهومی، نه خروجی واقعی</small>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
