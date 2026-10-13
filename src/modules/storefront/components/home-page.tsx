"use client";

import { useState } from "react";
import { useCart } from "@/modules/cart";
import {
  categories,
  CategorySection,
  FeaturedProductsSection,
  filterCatalog,
  isPromotion,
  type CategoryId,
} from "@/modules/catalog";
import { StorefrontNavigation } from "@/modules/support";
import { StoreHeader } from "@/components/layout";
import { HeroSection } from "./hero-section";
import { StoreBenefits } from "./store-benefits";

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [addedMessage, setAddedMessage] = useState("");
  const { addItem } = useCart();
  const categoryLabel = categories.find((category) => category.id === selectedCategory)?.label ?? null;
  const filteredItems = filterCatalog(selectedCategory);
  const products = filteredItems.filter((item) => !isPromotion(item));

  function handleAdd(item: Parameters<typeof addItem>[0]) {
    addItem(item);
    setAddedMessage(`${item.name} se agregó al carrito`);
    window.setTimeout(() => setAddedMessage(""), 2800);
  }

  return (
    <div className="storefront" id="inicio">
      <StoreHeader />
      <main className="storefront-main">
        <HeroSection />
        <StoreBenefits />
        <CategorySection
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
