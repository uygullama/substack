import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { HeadingAnimation } from "@/components/common/heading-animation";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24 flex flex-col items-center text-center">
      <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-8 transition-colors hover:bg-muted/50">
        <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
        Your Digital Transformation Partner
        <ArrowRight className="ml-2 h-4 w-4 text-muted-foreground" />
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mb-6">
        <HeadingAnimation>
          Technology Solutions <br className="hidden md:inline" /> Shaping the
          Future
        </HeadingAnimation>
      </h1>

      <p className="text-xl text-muted-foreground max-w-2xl mb-10">
        We provide sustainable and innovative software solutions that improve
        your business processes. We follow and apply the developments in the
        technology world for you.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="#contact">Get Directions</Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          asChild
          className="rounded-full px-8"
        >
          <Link href="#about">About Us</Link>
        </Button>
      </div>
    </section>
  );
}
