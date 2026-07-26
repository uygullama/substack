import Link from "next/link";
import { notFound } from "next/navigation";
import SubstackContent from "@/components/common/substack-content";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/lib/config/site.paths";
import type { Locale } from "@/lib/config/site.types";
import { substack } from "@/lib/substack";

async function getPost(slug: string) {
  return substack.getPost(slug);
}

export async function PostPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const post = await getPost(slug);
  const dict = await getDictionary(locale);

  if (!post) {
    notFound();
  }

  // Locale fallback validation check will be added in Phase 5

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-16 pt-32 pb-16">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={localizedPath(locale, "/")}>
              {dict.post.home}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {post.postTags && post.postTags.length > 0 ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${post.postTags[0].slug}`}>
                  {post.postTags[0].name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          ) : (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href={localizedPath(locale, "/posts")}>
                  {dict.post.news}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">
              {post.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
        {post.title}
      </h1>
      {post.subtitle && (
        <h2 className="text-xl text-gray-500 mb-8">{post.subtitle}</h2>
      )}

      <SubstackContent html={post.body_html} />

      {post.postTags && post.postTags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.postTags.map((tag) => (
            <Link
              key={tag.id}
              href={localizedPath(locale, `/tags/${tag.slug}`)}
              className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      {post.canonical_url && (
        <div className="mt-12 flex justify-center border-t pt-8">
          <a
            href={post.canonical_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-md bg-secondary px-8 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {dict.post.readOnSubstack}
          </a>
        </div>
      )}
    </div>
  );
}
