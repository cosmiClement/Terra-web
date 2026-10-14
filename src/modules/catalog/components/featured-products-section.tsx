import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/modules/catalog/domain/catalog-data";
import { StoreIcon } from "@/components/ui/store-icon";

type FeaturedProductsSectionProps = {
  products: Product[];
  categoryLabel: string | null;
  onAddToCart: (product: Product) => void;
};

export function FeaturedProductsSection({ products, categoryLabel, onAddToCart }: FeaturedProductsSectionProps) {
  return (
    <section className="featured-section" id="productos" aria-labelledby="featured-title">
      <div className="section-heading">
        <div>
          <p className="section-kicker">SELECCIÓN TERRA</p>
          <h2 id="featured-title">Productos destacados</h2>
        </div>
        <Link className="text-link featured-more" href="/catalog">Ver catálogo <span aria-hidden="true">→</span></Link>
        {categoryLabel && <p className="catalog-filter-label">Categoría: {categoryLabel}</p>}
      </div>

      <div className="featured-grid">
        {products.map((product, index) => (
          <article className="featured-card" key={product.id}>
            <div className="featured-image-wrap">
              <Image src={product.image} alt={product.name} fill unoptimized sizes="(max-width: 700px) 36vw, 100px" />
              <span className={`featured-badge${index === 0 ? " featured-badge--blue" : ""}`}>{index === 0 ? "Más vendido" : "Nuevo"}</span>
            </div>
            <div className="featured-details">
              <span className="catalog-reference">Modelo {product.reference}</span>
              <h3><Link href={`/products/${product.id}`}>{product.name}</Link></h3>
              <p className="featured-price">{product.price}</p>
            <Link className="featured-view-link" href={`/products/${product.id}`}>Ver producto</Link>
            </div>
            <button
              className="quick-add"
              type="button"
              aria-label={`Agregar ${product.name} al carrito`}
              onClick={() => onAddToCart(product)}
            >
              <StoreIcon name="add-to-cart" />
            </button>
          </article>
        ))}
        {products.length === 0 && (
          <p className="catalog-empty-state">Todavía no hay productos destacados en esta categoría.</p>
        )}
      </div>
    </section>
  );
}
