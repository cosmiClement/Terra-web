import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductDetailPage, catalogItems, getCatalogItem } from "@/modules/catalog";

export function generateStaticParams() {
  return catalogItems.map((item) => ({ id: item.id }));
}

async function Details({
  params,
}: {
  params: PageProps<"/products/[id]">["params"];
}) {
  const { id } = await params;
  const item = getCatalogItem(id);

  if (!item) notFound();

  return <ProductDetailPage item={item} />;
}

export default function Page({ params }: PageProps<"/products/[id]">) {
  return (
    <Suspense fallback={<div className="detail-page">Cargando producto...</div>}>
      <Details params={params} />
    </Suspense>
  );
}