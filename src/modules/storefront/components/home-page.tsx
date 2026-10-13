"use client";

import { useState } from "react";
import { useCart } from "@/modules/cart";
import {
  categories,
  CategorySection,
  FeaturedProductsSection,
  filterCatalog,
  isPromotion,
  SpecialOffersSection,
  type CategoryId,
} from "@/modules/catalog";
import { StorefrontNavigation } from "@/modules/support";
import { StoreHeader } from "@/components/layout";
import { HeroSection } from "./hero-section";

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const { addItem } = useCart();
  const categoryLabel = categories.find((category) => category.id === selectedCategory)?.label ?? null;
  const filteredItems = filterCatalog(selectedCategory);
  const products = filteredItems.filter((item) => !isPromotion(item));
  const promotions = filteredItems.filter(isPromotion);

  return (
    <div className="storefront" id="inicio">
      <StoreHeader />
      <main className="storefront-main">
        <HeroSection />
        <CategorySection
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onShowAll={() => setSelectedCategory(null)}
        />
        <div className="product-content-section">
          <FeaturedProductsSection
            products={products}
            categoryLabel={categoryLabel}
            onAddToCart={addItem}
          />
          <SpecialOffersSection offers={promotions} onAddToCart={addItem} />
        </div>
      </main>
      <StorefrontNavigation />
    </div>
  );
}
