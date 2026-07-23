import Image from "next/image";
import Link from "next/link";
import lamaSvg from "@/assets/lama.svg";

export default function DevelopedBy() {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="https://uygulama.net/#templates"
        className="shrink-0 transition-opacity hover:opacity-80"
      >
        <Image src={lamaSvg} alt="uyguLama" className="h-10 w-auto" />
      </Link>
      <p className="text-sm text-muted-foreground text-left leading-tight">
        <Link
          href="https://uygulama.net/#templates"
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
