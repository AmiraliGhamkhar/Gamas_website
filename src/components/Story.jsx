import Icon from './Icon'
import { sitePath } from '../lib/constants'

const outcomes = [
  { icon: 'audio', title: 'از صدا، متن می‌سازد', text: 'گفتار کلاس را برای مرور آماده می‌کند.' },
  { icon: 'notes', title: 'نکته‌ها را مرتب می‌کند', text: 'سرفصل‌ها و نکات کلیدی را از دل جلسه بیرون می‌کشد.' },
  { icon: 'presentation', title: 'اسلاید را جا نمی‌اندازد', text: 'متن و محتوای پاورپوینت را کنار هم می‌آورد.' },
]

export default function Story() {
  return (
    <section id="story" className="product-tile product-tile-light story-section">
      <div className="container">
        <div className="story-card">
          <div className="story-copy">
            <h2 className="section-title">حواست به کلاس باشد، نه به جزوه‌نویسی.</h2>
            <p className="section-description">
              بعد از کلاس لازم نیست دوباره ساعت‌ها فایل را گوش کنی. گاماس نکته‌های مهم را به یک جزوه‌ی خوانا تبدیل می‌کند تا زودتر برسی به فهمیدن و مرور کردن.
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
              ببین چطور کار می‌کند <Icon name="arrow-left" size={18} />
            </a>
          </div>

          <figure className="story-visual">
            <div className="story-visual-badge"><span className="badge-spark">✦</span> تمرکز روی یادگیری</div>
            <img
              src={sitePath('images/illustration-student.webp')}
              width="1280"
              height="960"
              loading="lazy"
              decoding="async"
              alt="تصویر مفهومی سه‌بعدی از دانشجویی که در کلاس با تلفن همراه، درس را ضبط می‌کند"
            />
            <figcaption className="story-visual-caption">از جلسه‌ی زنده تا مرورِ راحت‌تر</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
