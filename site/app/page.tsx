import Nav from "@/components/layouts/Nav";
import Footer from "@/components/layouts/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <About />
      </main>
      <Footer />
    </>
  );
}
