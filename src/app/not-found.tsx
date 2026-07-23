import Link from 'next/link';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-6xl md:text-8xl font-black text-zinc-200 mb-6 tracking-tighter">404</h1>
        <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
          Sayfa Bulunamadı
        </h2>
        <p className="text-muted-foreground mb-10 max-w-md">
          Aradığınız sayfa yayından kaldırılmış, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Ana Sayfaya Dön
        </Link>
      </main>
      
      <Footer />
    </div>
  );
}
