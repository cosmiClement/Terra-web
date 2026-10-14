import { notFound } from "next/navigation";
import { catalogItems } from "@/modules/catalog";
import ProductDetailRoute from "./product-detail-route";

export const instant = false;

export function generateStaticParams() {
  return catalogItems.map((item) => ({ id: item.id }));
}

export default async function Page({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  if (!id) notFound();
  return <ProductDetailRoute id={id} />;
}
