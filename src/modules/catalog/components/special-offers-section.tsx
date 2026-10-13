import Image from "next/image";
import Link from "next/link";
import type { Promotion } from "@/modules/catalog/domain/catalog-data";
import { StoreIcon } from "@/components/ui/store-icon";

type SpecialOffersSectionProps = {
  offers: Promotion[];
  onAddToCart: (promotion: Promotion) => void;
};

export function SpecialOffersSection({ offers, onAddToCart }: SpecialOffersSectionProps) {
  return (
    <section className="offers-section" id="promociones" aria-labelledby="offers-title">
      <div className="section-heading offers-heading">
        <div>
          <p className="section-kicker">OPORTUNIDADES PARA TU HOGAR</p>
          <h2 id="offers-title">Promociones destacadas</h2>
        </div>
        <span className="expiry-badge">DATOS DEMO</span>
      </div>

      <div className="offers-list">
        {offers.map((offer) => (
          <article className={`offer-card offer-card--${offer.badgeType}`} key={offer.id}>
            <span className="offer-badge">{offer.badge}</span>
            <div className="offer-image-wrap">
              <Image src={offer.image} alt={offer.name} fill sizes="80px" />
            </div>
            <div className="offer-details">
              <h3><Link href={`/products/${offer.id}`}>{offer.name}</Link></h3>
              <p>
                <strong>{offer.price}</strong>
                <del>{offer.oldPrice}</del>
              </p>
            </div>
            <button
              className="offer-add"
              type="button"
              aria-label={`Agregar ${offer.name} al carrito`}
              onClick={() => onAddToCart(offer)}
            >
              <StoreIcon name="add-to-cart" />
            </button>
          </article>
        ))}
        {offers.length === 0 && <p className="catalog-empty-state">No hay promociones en esta categoría.</p>}
      </div>
    </section>
  );
}
