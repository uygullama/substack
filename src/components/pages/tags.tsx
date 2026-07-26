import { notFound } from "next/navigation";
import { getArchivePosts } from "@/app/actions";
import PostList from "@/components/feature/post-list";
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

export async function TagsPage({
  locale,
  tag,
}: {
  locale: Locale;
  tag: string;
}) {
  const tagData = substack.getTagBySlug(tag);

  if (!tagData) {
    notFound();
  }

  const initialPosts = await getArchivePosts(0, 20, tagData.id);
  const dict = await getDictionary(locale);

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
          <BreadcrumbItem>
            <BreadcrumbPage>{tagData.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-12 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          #{tagData.name}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-lg md:text-xl">
          {dict.tags.latestUpdates.replace("{tag}", tagData.name)}
        </p>
      </div>

      <PostList
        initialPosts={initialPosts}
        postTagId={tagData.id}
        locale={locale}
        dict={dict.common}
      />
    </div>
  );
}
