import Nav from "@/components/layouts/Nav";
import Footer from "@/components/layouts/Footer";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
      </main>
      <Footer />
    </>
  );
}
