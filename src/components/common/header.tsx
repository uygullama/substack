"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import siteData from "@/data/site.json";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("");
  const pathname = usePathname();

  const getHref = (href: string) => {
    if (href.startsWith("tag:")) {
      return `/${href.replace("tag:", "")}`;
    }
    if (href.startsWith("#") && pathname !== "/") {
      return `/${href}`;
    }
    return href;
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const sectionIds = siteData.navigation
        .filter((item) => item.href.startsWith("#"))
        .map((item) => item.href.replace("#", ""));
      let current = "";

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3) {
            current = `#${id}`;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Use a short timeout to ensure elements are fully rendered before initial check
    const timeout = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {/* Fixed horizontal line */}
      <div className="fixed top-14 left-0 w-full h-[1px] bg-border/60 z-40" />
      {/* Fading blur and background effect below the line */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl  h-14 z-30 pointer-events-none backdrop-blur-md" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl  border-l border-r h-14 z-30 pointer-events-none bg-gradient-to-b from-background/90 to-transparent" />

      <header className="fixed top-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 rounded-xl border bg-background/80 backdrop-blur-md px-4 py-3 shadow-sm transition-all">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src={logo} alt={siteData.siteName} className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {siteData.navigation.map((item) => (
              <Link
                key={item.href}
                href={getHref(item.href)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground relative",
                  activeSection === item.href
                    ? "text-foreground font-semibold"
                    : "text-foreground/60",
                )}
              >
                {item.label}
                {activeSection === item.href && (
                  <span className="absolute -bottom-[22px] left-0 w-full h-[2px] bg-primary rounded-t-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            <Button asChild className="rounded-full px-6">
              <Link href={pathname !== "/" ? "/#contact" : "#contact"}>
                Get directions
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="h-8 w-8 rounded-md"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm md:hidden">
          <div className="fixed left-4 right-4 top-4 rounded-2xl border bg-background p-4 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <Image
                  src={logo}
                  alt={siteData.siteName}
                  className="h-8 w-auto"
                />
              </Link>
              <div className="flex items-center gap-2">
                <Button asChild className="rounded-full px-5 h-10">
                  <Link
                    href={pathname !== "/" ? "/#contact" : "#contact"}
                    onClick={() => setIsOpen(false)}
                  >
                    Get directions
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-10 w-10 rounded-md border-muted-foreground/20"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
            </div>

            <nav className="flex flex-col gap-4">
              {siteData.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={getHref(item.href)}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-base font-medium py-2 border-b border-muted/50 last:border-0 transition-colors flex items-center justify-between",
                    activeSection === item.href
                      ? "text-primary font-bold"
                      : "text-foreground/80 hover:text-foreground",
                  )}
                >
                  {item.label}
                  {activeSection === item.href && (
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="mt-6">
              <Button
                variant="secondary"
                asChild
                className="w-full h-12 rounded-xl text-base bg-muted/50 hover:bg-muted"
              >
                <Link
                  href={pathname !== "/" ? "/#contact" : "#contact"}
                  onClick={() => setIsOpen(false)}
                >
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
