import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewsCarousel from "@/components/NewsCarousel";
import MdxSection from "@/components/MdxSection";
import TemplatesSection from "@/components/TemplatesSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <NewsCarousel />
        <MdxSection id="about" filename="about.mdx" className="bg-muted/10" />
        <TemplatesSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
