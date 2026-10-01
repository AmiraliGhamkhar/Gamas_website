import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Story from './components/Story'
import BotDemo from './components/BotDemo'
import HowItWorks from './components/HowItWorks'
import Capabilities from './components/Capabilities'
import Privacy from './components/Privacy'
import FAQ from './components/FAQ'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import MobileSticky from './components/MobileSticky'

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero />
        <Story />
        <BotDemo />
        <HowItWorks />
        <Capabilities />
        <Privacy />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobileSticky />
    </div>
  )
}
