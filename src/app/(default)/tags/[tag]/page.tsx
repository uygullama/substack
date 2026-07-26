import { TagsPage } from "@/components/pages/tags";
import { defaultLocale } from "@/lib/config/site.resolver";

export const revalidate = 300;

export default async function Page({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return <TagsPage locale={defaultLocale} tag={tag} />;
}
