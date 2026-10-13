import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/modules/catalog";
import { catalogItems, getCatalogItem } from "@/modules/catalog";

export function generateStaticParams() {
  return catalogItems.map((item) => ({ id: item.id }));
}

export default async function Page({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const item = getCatalogItem(id);

  if (!item) {
    notFound();
  }

  return <ProductDetailPage item={item} />;
}
