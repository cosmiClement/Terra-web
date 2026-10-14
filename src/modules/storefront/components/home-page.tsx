"use client";

import { useState } from "react";
import { useCart } from "@/modules/cart";
import {
  CategorySection,
  FeaturedProductsSection,
  filterCatalog,
  isPromotion,
  type CategoryId,
} from "@/modules/catalog";
import { useCatalogData } from "@/modules/catalog/application/use-catalog-data";
import { StorefrontNavigation } from "@/modules/support";
import { StoreHeader } from "@/components/layout";
import { HeroSection } from "./hero-section";
import { StoreBenefits } from "./store-benefits";

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [addedMessage, setAddedMessage] = useState("");
  const { addItem } = useCart();
  const { categories, items, isLoading, error, usingApi } = useCatalogData();
  const categoryLabel = categories.find((category) => category.id === selectedCategory)?.label ?? null;
  const filteredItems = filterCatalog(selectedCategory, "", items);
  const products = filteredItems.filter((item) => !isPromotion(item));

  async function handleAdd(item: Parameters<typeof addItem>[0]) {
    try {
      await addItem(item);
      setAddedMessage(`${item.name} se agregó al carrito`);
    } catch (reason) {
      setAddedMessage(reason instanceof Error ? reason.message : "No se pudo sincronizar el carrito.");
    }
    window.setTimeout(() => setAddedMessage(""), 3800);
  }

  return (
    <div className="storefront" id="inicio">
      <StoreHeader />
      <main className="storefront-main">
        <HeroSection promotions={items.filter(isPromotion)} />
        <StoreBenefits />
        {isLoading ? (
          <p className="flow-note" role="status">Cargando catálogo…</p>
        ) : error ? (
          <p className="flow-error" role="alert">No se pudo cargar el catálogo desde el backend: {error}</p>
        ) : (
          <>
            <CategorySection
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onShowAll={() => setSelectedCategory(null)}
            />
            <div className="product-content-section">
              <FeaturedProductsSection
                products={products}
                categoryLabel={categoryLabel}
                onAddToCart={handleAdd}
              />
            </div>
          </>
        )}
        {!usingApi && <p className="flow-note">Modo demostración: configura las variables de Supabase para conectar el frontend.</p>}
      </main>
      <StorefrontNavigation />
      {addedMessage && (
        <p className="fixed bottom-20 left-1/2 z-30 -translate-x-1/2 rounded-full bg-terra-navy px-5 py-3 text-center text-sm font-bold text-white shadow-xl" role="status">
          {addedMessage}
        </p>
      )}
    </div>
  );
}
