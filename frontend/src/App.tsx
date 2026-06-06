import Cursor from './components/Cursor'
import SqlRain from './components/SqlRain'
import Hero from './components/Hero'
import Stack from './components/Stack'
import Contacts from './components/Contacts'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Cursor />
      <SqlRain />
      <div className="noise" />

      <div className="wrap">
        <Hero />
        <Stack />
        <Contacts />
        <Footer />
      </div>
    </>
  )
}
