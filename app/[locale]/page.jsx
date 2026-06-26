import {setRequestLocale} from 'next-intl/server';
import Nav from '../../components/Nav';
import Hero from '../../components/Hero';
import Credentials from '../../components/Credentials';
import About from '../../components/About';
import WhoRoyTrains from '../../components/WhoRoyTrains';
import ProgramTeaser from '../../components/ProgramTeaser';
import BeforeAfter from '../../components/BeforeAfter';
import Testimonials from '../../components/Testimonials';
import Contact from '../../components/Contact';
import Footer from '../../components/Footer';

export default async function HomePage({params}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Credentials />
        <About />
        <WhoRoyTrains />
        <ProgramTeaser />
        <BeforeAfter />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
