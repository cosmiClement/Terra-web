"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/modules/cart";
import { StoreHeader } from "@/components/layout";
import type { CatalogItem } from "../domain/catalog-data";
import { isPromotion } from "../domain/catalog-data";

export function ProductDetailPage({ item }: { item: CatalogItem }) {
  const [quantity, setQuantity] = useState(1);
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
        <Link className="flow-back-link" href="/catalog">← Volver al catálogo</Link>
        <div className="product-detail-layout">
          <div className="product-detail-image">
            <Image src={item.image} alt={item.name} fill sizes="(max-width: 720px) 100vw, 55vw" priority />
            {promotion && <span className="catalog-discount-badge">{promotion.badge}</span>}
          </div>
          <section className="product-detail-info">
            <p className="eyebrow">{promotion ? "PROMOCIÓN DE DEMOSTRACIÓN" : "PRODUCTO DE DEMOSTRACIÓN"}</p>
            <p className="catalog-reference">Modelo {item.reference}</p>
            <h1>{item.name}</h1>
            <p className="detail-price">
              <strong>{item.price}</strong>
              {promotion && <del>{promotion.oldPrice}</del>}
            </p>
            <p className="detail-description">{item.description}</p>
            <div className="detail-availability">
              <strong>Medidas, variantes y disponibilidad</strong>
              <span>Información no conectada. Consultar con el equipo de tienda.</span>
            </div>
            <label className="quantity-control detail-quantity">
              Cantidad
              <input min="1" max="99" type="number" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))} />
            </label>
            <button className="touch-action detail-add-button" type="button" onClick={handleAdd}>
              Agregar al carrito
            </button>
            {added && <p className="flow-success" role="status">Agregado al carrito. Puedes seguir explorando o revisar tu selección.</p>}
            <Link className="secondary-action detail-cart-link" href="/cart">Ver carrito</Link>
          </section>
        </div>
        <p className="catalog-disclaimer">Las imágenes, precios y promociones son datos de demostración; confirma la información vigente en tienda.</p>
      </main>
    </>
  );
}
