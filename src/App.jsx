import { useEffect } from 'react'
import Preloader from './components/Preloader'
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
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduced-motion')
    }
  }, [])

  return (
    <div className="min-h-dvh flex flex-col bg-bg">
      <Preloader />
      <Navbar />
      <main className="flex-1">
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
