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
import { getArchivePosts } from "./actions";

export const revalidate = 3600; // Cache for 1 hour

export default async function PostsPage() {
  const initialPosts = await getArchivePosts(0, 20);

  return (
    <>
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-16 pt-32 pb-16">
        <Breadcrumb className="mb-8 px-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>News</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-12 text-center md:text-left px-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            News & Announcements
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            You can access all current developments, news, and announcements
            here.
          </p>
        </div>

        <PostList initialPosts={initialPosts} />
      </main>

      <Footer />
    </>
  );
}
