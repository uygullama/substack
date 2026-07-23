import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SubstackContent from "@/components/SubstackContent";

export const revalidate = 3600; // Hourly cache

import { substack } from "@/lib/substack";

async function getPost(slug: string) {
  return substack.getPost(slug);
}

export default async function HaberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 md:px-12 pt-32 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
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
                href={`/${tag.slug}`}
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
              Read on Substack
            </a>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
