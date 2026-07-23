import { LayoutTemplate, Sparkles } from "lucide-react";
import Link from "next/link";
import { HeadingAnimation } from "@/components/common/heading-animation";

export default function TemplatesSection() {
  return (
    <section id="templates" className="container mx-auto px-4 py-20 md:py-32">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-6">
          <Sparkles className="mr-2 h-4 w-4 text-primary" />
          Website Solution Packages
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl">
          <HeadingAnimation>Our Ready Solutions</HeadingAnimation>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto px-6">
        <div className="flex flex-col p-6 rounded-2xl border bg-card text-card-foreground hover:border-primary/50 transition-colors shadow-sm text-center">
          <div className="mb-6 flex justify-center">
            <LayoutTemplate
              className="h-12 w-12 text-foreground"
              strokeWidth={1.5}
            />
          </div>
          <h3 className="text-xl font-semibold mb-3 tracking-tight">
            Substack Template
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
            A website solution package that allows you to manage your content
            with Substack.
          </p>
        </div>
      </div>

      <div className="mt-16 text-center max-w-xl mx-auto">
        <p className="text-muted-foreground text-sm">
          For any website needs, you can contact us from the{" "}
          <Link
            href="#contact"
            className="text-primary font-medium hover:underline"
          >
            "contact us"
          </Link>{" "}
          section.
        </p>
      </div>
    </section>
  );
}
