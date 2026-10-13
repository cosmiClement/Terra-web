import Image from "next/image";
import Link from "next/link";
import type { CategoryId } from "@/modules/catalog/domain/catalog-data";
import { categories } from "@/modules/catalog/domain/catalog-data";
import { StoreIcon } from "@/components/ui/store-icon";

type CategorySectionProps = {
  selectedCategory: CategoryId | null;
  onSelectCategory: (category: CategoryId) => void;
  onShowAll: () => void;
};

export function CategorySection({ selectedCategory, onSelectCategory, onShowAll }: CategorySectionProps) {
  return (
    <section className="content-section category-section" id="categorias" aria-labelledby="categories-title">
      <div className="section-heading">
        <h2 id="categories-title">Explora Categorías</h2>
        <div className="category-heading-actions">
          <button className="text-link category-reset" type="button" onClick={onShowAll}>
            Ver todas <StoreIcon name="chevron-right" />
          </button>
          <Link className="text-link" href="/catalog">Abrir catálogo</Link>
        </div>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <button
            aria-pressed={selectedCategory === category.id}
            className={`category-card${selectedCategory === category.id ? " is-selected" : ""}`}
            key={category.id}
            onClick={() => {
              onSelectCategory(category.id);
              document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
            }}
            type="button"
          >
            <span className="category-image-wrap">
              <Image src={category.image} alt="" fill sizes="(max-width: 700px) 38vw, 160px" />
            </span>
            <span className="category-name">{category.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
