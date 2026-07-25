import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import ContactSection from "@/components/feature/contact-section";
import DynamicSection from "@/components/feature/dynamic-section";
import Hero from "@/components/feature/hero";
import NewsCarousel from "@/components/feature/news-carousel";
import ServicesSection from "@/components/feature/services-section";
import TemplatesSection from "@/components/feature/templates-section";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <NewsCarousel />
        {/* <MdxSection id="about" filename="about.mdx" className="bg-muted/10" /> */}
        <DynamicSection
          id="about"
          className="bg-muted/10"
          imagePosition="left"
        />
        <TemplatesSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
