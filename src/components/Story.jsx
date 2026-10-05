import Icon from './Icon'
import ResponsiveIllustration from './ResponsiveIllustration'

const outcomes = [
  { icon: 'audio', title: 'گفتار را به متن تبدیل می‌کند', text: 'رونوشت فارسی برای برگشتن به نکته‌های کلاس.' },
  { icon: 'notes', title: 'مطالب را مرتب می‌کند', text: 'برای مرور، نکته‌ها و موضوع‌های درس را کنار هم می‌گذارد.' },
  { icon: 'presentation', title: 'از اسلایدها هم کمک می‌گیرد', text: 'در فایل‌های PowerPoint، متن اسلایدها هم وارد جزوه می‌شود.' },
]

export default function Story() {
  return (
    <section id="story" className="product-tile product-tile-light story-section">
      <div className="container">
        <div className="story-card">
          <div className="story-copy">
            <h2 className="section-title">سر کلاس گوش بده؛ جزوه را بعداً مرور کن.</h2>
            <p className="section-description">
              جزوه‌نویسی هم‌زمان با کلاس همیشه شدنی نیست. وقتی فایل ضبط‌شده مانده و وقت گوش‌دادن دوباره نداری، گاماس گفتار را به متن فارسی تبدیل می‌کند و نکته‌های درس را برای مرور کنار هم می‌گذارد.
            </p>

            <ul className="outcome-list">
              {outcomes.map((item) => (
                <li key={item.title}>
                  <span className="outcome-icon"><Icon name={item.icon} size={19} /></span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.text}</small>
                  </span>
                </li>
              ))}
            </ul>

            <a href="#how" className="text-link">
              مراحل کار را ببین <Icon name="arrow-left" size={18} />
            </a>
          </div>

          <figure className="story-visual">
            <div className="story-visual-badge"><span className="badge-spark">✦</span> وقت بیشتر برای یادگیری</div>
            <ResponsiveIllustration
              name="student"
              sizes="(max-width: 639px) 360px, 600px"
              alt="تصویر مفهومی از دانشجویی که در کلاس درس را دنبال می‌کند و یادداشت برمی‌دارد"
            />
            <figcaption className="story-visual-caption">تصویر مفهومی از یک موقعیت آشنا برای دانشجوها</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
