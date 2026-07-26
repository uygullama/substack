import Image from "next/image";
import Link from "next/link";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/lib/config/site.paths";
import type { Locale } from "@/lib/config/site.types";
import { substack } from "@/lib/substack";

export default async function NewsCarousel({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  try {
    const posts = await substack.getPosts(0, 10);

    const items = posts.map((item) => {
      return {
        title: item.title,
        slug: item.slug,
        subtitle: item.subtitle || item.description || "",
        imageUrl: item.cover_image,
        pubDate: item.post_date
          ? new Date(item.post_date).toLocaleDateString(locale, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "",
      };
    });

    if (items.length === 0) {
      return null;
    }

    return (
      <section className="px-4 py-12 md:py-16 bg-zinc-50 shadow-inner border-y">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-8 px-4 md:px-12">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                {dict.newsCarousel.title}
              </h2>
              <p className="text-muted-foreground">
                {dict.newsCarousel.description}
              </p>
            </div>
            <Link
              href={localizedPath(locale, "/posts")}
              className="hidden sm:inline-flex text-sm font-medium text-primary hover:underline"
            >
              {dict.common.viewAll} &rarr;
            </Link>
          </div>

          <div className="px-4 md:px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {items.map((item) => (
                  <CarouselItem
                    key={item.slug}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <Link
                      href={localizedPath(locale, `/posts/${item.slug}`)}
                      className="block h-full"
                    >
                      <div className="border rounded-lg shadow-sm bg-background overflow-hidden h-full flex flex-col hover:border-primary/50 transition-colors">
                        {item.imageUrl ? (
                          <div className="relative w-full h-48 bg-muted border-b">
                            <Image
                              src={item.imageUrl}
                              alt={item.title || "News image"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-muted flex items-center justify-center border-b">
                            <span className="text-muted-foreground">
                              {dict.common.noImage}
                            </span>
                          </div>
                        )}
                        <CardHeader className="p-4 pb-2">
                          <div className="text-xs text-muted-foreground mb-2">
                            {item.pubDate}
                          </div>
                          <CardTitle className="text-lg leading-tight line-clamp-2">
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 flex-1">
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {item.subtitle}
                          </p>
                        </CardContent>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12" />
              <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return (
      <div className="p-8 text-center border rounded-lg bg-muted/30 max-w-3xl mx-auto my-12 text-muted-foreground">
        {dict.newsCarousel.error}
      </div>
    );
  }
}
