import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { getArchivePosts } from "@/app/posts/actions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PostList from "@/components/PostList";

export const revalidate = 300; // Cache for 5 minutes

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  // Read tags from tags.json
  const tagsPath = path.join(process.cwd(), "src/data/tags.json");
  let tags: { id: string; name: string; slug: string }[] = [];

  try {
    if (fs.existsSync(tagsPath)) {
      const fileContent = fs.readFileSync(tagsPath, "utf-8");
      tags = JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Error reading tags.json:", error);
  }

  const tagData = tags.find((t) => t.slug === tag);

  if (!tagData) {
    notFound();
  }

  const initialPosts = await getArchivePosts(0, 20, tagData.id);

  return (
    <>
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 pt-32 pb-16">
        <div className="mb-12 text-center md:text-left px-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            #{tagData.name}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            "{tagData.name}" etiketiyle ilgili en güncel gelişmeler.
          </p>
        </div>

        <PostList initialPosts={initialPosts} postTagId={tagData.id} />
      </main>

      <Footer />
    </>
  );
}
