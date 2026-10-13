import { Suspense } from "react";
import { CatalogPage } from "@/modules/catalog";

type CatalogRouteProps = {
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
};

export default function Page({ searchParams }: CatalogRouteProps) {
  return (
    <Suspense fallback={<main aria-live="polite" className="catalog-page" role="status">Cargando catálogo…</main>}>
      <CatalogRoute searchParams={searchParams} />
    </Suspense>
  );
}

async function CatalogRoute({ searchParams }: CatalogRouteProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";

  return <CatalogPage key={`${query}:${category}`} initialQuery={query} initialCategory={category} />;
}
