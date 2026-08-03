import Nav from "@/components/layouts/Nav";
import Footer from "@/components/layouts/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Values from "@/components/sections/Values";
import Vision from "@/components/sections/Vision";
import Services from "@/components/sections/Services";
import Events from "@/components/sections/Events";
import Gallery from "@/components/sections/Gallery";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <About />
        <Values />
        <Vision />
        <Services />
        <Events />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
