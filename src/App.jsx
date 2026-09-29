import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Story from './components/Story'
import Bento from './components/Bento'
import BotDemo from './components/BotDemo'
import HowItWorks from './components/HowItWorks'
import Access from './components/Access'
import Testimonials from './components/Testimonials'
import Privacy from './components/Privacy'
import FAQ from './components/FAQ'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import MobileSticky from './components/MobileSticky'

export default function App() {
  useEffect(() => {
    let cancelled = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    document.fonts?.ready.then(async () => {
      if (cancelled || reducedMotion) return
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      ScrollTrigger.refresh()
    })

    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-dvh flex flex-col">
      <a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero />
        <Story />
        <Bento />
        <BotDemo />
        <HowItWorks />
        <Access />
        <Testimonials />
        <Privacy />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobileSticky />
    </div>
  )
}
