"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/modules/cart";
import { StoreHeader } from "@/components/layout";
import { StoreIcon } from "@/components/ui/store-icon";
import type { CatalogItem } from "../domain/catalog-data";
import { isPromotion } from "../domain/catalog-data";

const demoVariants = [
  { name: "Estándar", value: "50 × 70 cm" },
  { name: "Queen", value: "50 × 90 cm" },
  { name: "King", value: "50 × 100 cm" },
];

export function ProductDetailPage({ item }: { item: CatalogItem }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const promotion = isPromotion(item) ? item : null;

  function handleAdd() {
    addItem(item, quantity);
    setAdded(true);
  }

  return (
    <>
      <StoreHeader />
      <main className="detail-page">
        <div className="detail-breadcrumbs">
          <Link className="flow-back-link" href="/catalog">← Catálogo</Link>
          <span>/</span>
          <span>{item.name}</span>
        </div>
        <div className="product-detail-layout">
          <section className="detail-gallery" aria-label="Galería del producto">
            <div className="product-detail-image w-full">
              <Image src={item.image} alt={item.name} fill sizes="(max-width: 900px) 100vw, 55vw" priority />
              {promotion && <span className="catalog-discount-badge">{promotion.badge}</span>}
              <span className="detail-demo-mark">Vista de demostración</span>
            </div>
            <div className="detail-thumbnails">
              <button aria-label="Vista principal del producto" className="detail-thumbnail is-selected" type="button">
                <Image src={item.image} alt="" fill sizes="96px" />
              </button>
              <span className="detail-more-photos">+<small>Más vistas<br />próximamente</small></span>
            </div>
          </section>

          <section className="product-detail-info">
            <div className="detail-title-row">
              <div>
                <div className="detail-labels">
                  <span className="detail-promotion-label">{promotion ? "PROMOCIÓN" : "PRODUCTO"}</span>
                  <span>Información de demostración</span>
                </div>
                <p className="catalog-reference">Modelo {item.reference}</p>
              </div>
              <span className="detail-demo-pill">DEMO</span>
            </div>
            <h1>{item.name}</h1>
            <div className="detail-rating" aria-label="Valoración de demostración no conectada">
              <span className="detail-stars">★★★★★</span>
              <span>Valoración demo</span>
            </div>
            <p className="detail-price">
              <strong>{item.price}</strong>
              {promotion && <del>{promotion.oldPrice}</del>}
              {promotion && <span className="detail-discount">{promotion.badge}</span>}
            </p>
            <p className="detail-description">{item.description}</p>

            <fieldset className="detail-variants">
              <legend>Medidas y variantes <span>(demostración)</span></legend>
              <div className="detail-variant-grid">
                {demoVariants.map((variant, index) => (
                  <button
                    aria-pressed={selectedVariant === index}
                    className={selectedVariant === index ? "is-selected" : ""}
                    key={variant.name}
                    onClick={() => setSelectedVariant(index)}
                    type="button"
                  >
                    <strong>{variant.name}</strong>
                    <span>{variant.value}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="detail-availability">
              <StoreIcon name="support" />
              <span><strong>Disponibilidad:</strong> consultar en tienda</span>
            </div>

            <div className="detail-purchase-row">
              <label className="quantity-control detail-quantity">
                Cantidad
                <span className="quantity-stepper">
                  <button aria-label="Reducir cantidad" disabled={quantity <= 1} onClick={() => setQuantity(quantity - 1)} type="button">−</button>
                  <input aria-label="Cantidad" min="1" max="99" type="number" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))} />
                  <button aria-label="Aumentar cantidad" disabled={quantity >= 99} onClick={() => setQuantity(quantity + 1)} type="button">+</button>
                </span>
              </label>
            </div>
            <div className="detail-actions">
              <button className="touch-action detail-add-button" type="button" onClick={handleAdd}>
                <StoreIcon name="add-to-cart" />
                Agregar al carrito
              </button>
              <Link className="secondary-action detail-cart-link" href="/cart">Ver carrito</Link>
            </div>
            {added && <p className="flow-success" role="status">Producto agregado. Puedes seguir explorando o revisar tu carrito.</p>}
          </section>
        </div>
        <p className="catalog-disclaimer">Las imágenes, precios, variantes y promociones son datos de demostración. Confirma la información vigente con el personal de tienda.</p>
      </main>
    </>
  );
}
