"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StoreHeader } from "@/components/layout";
import { ProductDetailPage } from "@/modules/catalog";
import { getCatalogItem, type CatalogItem } from "@/modules/catalog";
import { getProduct, isApiConfigured, mapApiProduct } from "@/lib/api/catalog-api";

function readCachedCatalogItem(id: string) {
  try {
    const cached = window.sessionStorage.getItem("terra-catalog-items");
    if (!cached) return null;
    const items = JSON.parse(cached) as CatalogItem[];
    return items.find((item) => item.id === id) ?? null;
  } catch {
    return null;
  }
}

function cacheCatalogItem(item: CatalogItem) {
  try {
    const cached = window.sessionStorage.getItem("terra-catalog-items");
    const items = cached ? JSON.parse(cached) as CatalogItem[] : [];
    window.sessionStorage.setItem(
      "terra-catalog-items",
      JSON.stringify([...items.filter((entry) => entry.id !== item.id), item]),
    );
  } catch {
    // La vista se conserva aunque sessionStorage no esté disponible.
  }
}

export default function ProductDetailRoute({ id }: { id: string }) {
  const [item, setItem] = useState<CatalogItem | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const cachedItem = readCachedCatalogItem(id) ?? getCatalogItem(id);
    if (cachedItem) {
      const timer = window.setTimeout(() => setItem(cachedItem), 0);
      return () => window.clearTimeout(timer);
    }

    if (!isApiConfigured) {
      const timer = window.setTimeout(() => setError("No encontramos este producto."), 0);
      return () => window.clearTimeout(timer);
    }

    let active = true;
    getProduct(id)
      .then(mapApiProduct)
      .then((product) => {
        if (active) {
          cacheCatalogItem(product);
          setItem(product);
        }
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "No se pudo cargar el producto.");
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (item) return <ProductDetailPage item={item} />;
  if (error) {
    return (
      <>
        <StoreHeader />
        <main className="flow-page">
          <section className="flow-card">
            <h1>No se pudo abrir el producto</h1>
            <p className="flow-error" role="alert">{error}</p>
            <Link className="flow-primary-link" href="/catalog">Volver al catálogo</Link>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <StoreHeader />
      <main aria-busy="true" aria-label="Cargando producto" className="detail-page animate-pulse">
        <div className="h-4 w-48 rounded bg-slate-200" />
        <div className="product-detail-layout">
          <div className="aspect-[1.15] w-full rounded-2xl bg-slate-200 lg:w-[56%]" />
          <div className="grid content-start gap-5 lg:w-[44%]">
            <div className="h-4 w-2/3 rounded bg-slate-200" />
            <div className="h-10 w-full rounded bg-slate-200" />
            <div className="h-8 w-1/2 rounded bg-slate-200" />
            <div className="h-20 w-full rounded bg-slate-200" />
            <div className="h-12 w-full rounded bg-slate-200" />
          </div>
        </div>
      </main>
    </>
  );
}
