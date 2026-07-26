import { PostPage } from "@/components/pages/post";
import { defaultLocale } from "@/lib/config/site.resolver";

export const revalidate = 3600;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PostPage locale={defaultLocale} slug={slug} />;
}
