import { notFound } from "next/navigation";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import PostList from "@/components/feature/post-list";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { substack } from "@/lib/substack";

export const revalidate = 300; // Cache for 5 minutes

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  const tagData = substack.getTagBySlug(tag);

  if (!tagData) {
    notFound();
  }

  const initialPosts = await substack.getPosts(0, 20, tagData.id);

  return (
    <>
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-16 pt-32 pb-16">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
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
          <p className="text-muted-foreground text-lg max-w-2xl">
            Latest updates related to the "{tagData.name}" tag.
          </p>
        </div>

        <PostList initialPosts={initialPosts} postTagId={tagData.id} />
      </main>

      <Footer />
    </>
  );
}
