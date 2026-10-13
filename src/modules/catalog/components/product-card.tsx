import Image from "next/image";
import Link from "next/link";
import type { CatalogItem } from "../domain/catalog-data";
import { isPromotion } from "../domain/catalog-data";

type ProductCardProps = {
  item: CatalogItem;
  onAdd: (item: CatalogItem) => void;
};

export function ProductCard({ item, onAdd }: ProductCardProps) {
  const promotion = isPromotion(item) ? item : null;

  return (
    <article className="group catalog-product-card">
      <Link className="catalog-product-image" href={`/products/${item.id}`} aria-label={`Ver ${item.name}`}>
        <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw" />
        {promotion && <span className="catalog-discount-badge">{promotion.badge}</span>}
      </Link>
      <div className="catalog-product-info">
        <p className="catalog-reference">Modelo {item.reference}</p>
        <h3><Link href={`/products/${item.id}`}>{item.name}</Link></h3>
        <p className="catalog-price-row">
          <strong>{item.price}</strong>
          {promotion && <del>{promotion.oldPrice}</del>}
        </p>
        <div className="catalog-card-actions">
          <Link className="secondary-action" href={`/products/${item.id}`}>Ver producto</Link>
          <button className="touch-action" type="button" onClick={() => onAdd(item)}>
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
