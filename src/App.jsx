import Navbar from './components/Navbar'
import StructuredData from './components/StructuredData'
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
    <div className="app-shell">
      <a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a>
      <StructuredData />
      <Navbar />
      <main id="main-content" className="app-main">
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
