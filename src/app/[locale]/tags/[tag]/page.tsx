import { TagsPage } from "@/components/pages/tags";
import { requireSecondaryLocale } from "@/lib/config/site.resolver";

export const revalidate = 300;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale: rawLocale, tag } = await params;
  const locale = requireSecondaryLocale(rawLocale);

  return <TagsPage locale={locale} tag={tag} />;
}
