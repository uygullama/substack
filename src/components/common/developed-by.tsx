import siteData from "@/data/site.json";
import Link from "next/link";
export default function DevelopedBy() {
  return (
    <div className="flex items-center gap-3">
      <Link
        href={`https://uygulama.net/?ref=${encodeURIComponent(siteData.url)}#templates`}
        className="shrink-0 transition-opacity hover:opacity-80"
      >
        {/* biome-ignore lint/performance/noImgElement: SVG optimization not needed */}
        <img src="/lama.svg" alt="uyguLama" className="h-10 w-auto" />
      </Link>
      <p className="text-sm text-muted-foreground text-left leading-tight">
        <Link
          href={`https://uygulama.net/?ref=${encodeURIComponent(siteData.url)}#templates`}
          className="hover:text-primary transition-colors font-semibold"
        >
          uyguLama Substack template
        </Link>{" "}
        ile
        <br className="hidden sm:block" /> geliştirilmiştir.
      </p>
    </div>
  );
}
