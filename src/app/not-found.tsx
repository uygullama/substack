import Link from "next/link";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-6xl md:text-8xl font-black text-zinc-200 mt-12 mb-6 tracking-tighter">
          404
        </h1>
        <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-10 max-w-md">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Return to Home
        </Link>
      </main>

      <Footer />
    </div>
  );
}
