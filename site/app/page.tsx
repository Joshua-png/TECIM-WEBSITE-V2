import Nav from "@/components/layouts/Nav";
import Footer from "@/components/layouts/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Values from "@/components/sections/Values";
import Vision from "@/components/sections/Vision";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <About />
        <Values />
        <Vision />
      </main>
      <Footer />
    </>
  );
}
