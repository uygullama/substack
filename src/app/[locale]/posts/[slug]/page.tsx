import { PostPage } from "@/components/pages/post";
import { requireSecondaryLocale } from "@/lib/config/site.resolver";

export const revalidate = 3600;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = requireSecondaryLocale(rawLocale);

  return <PostPage locale={locale} slug={slug} />;
}
