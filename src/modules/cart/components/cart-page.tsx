"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../application/cart-context";
import { StoreHeader } from "@/components/layout";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function CartPage() {
  const { items, subtotal, savings, total, removeItem, setQuantity } = useCart();

  return (
    <>
      <StoreHeader />
      <main className="flow-page">
      <Link className="flow-back-link" href="/">← Volver a la tienda</Link>
      <h1>Mi carrito</h1>
      {items.length === 0 ? (
        <section className="flow-card">
          <p>Tu carrito está vacío.</p>
          <Link className="flow-primary-link" href="/#productos">Explorar productos</Link>
        </section>
      ) : (
        <>
          <div className="cart-lines">
            {items.map((item) => (
              <article className="flow-card cart-line" key={item.id}>
                <div>
                  <Image className="cart-line-image" src={item.image} alt={item.name} width={100} height={86} />
                  <h2>{item.name}</h2>
                  {item.reference && <p className="catalog-reference">Modelo {item.reference}</p>}
                  <p>{currency.format(item.unitPrice)} por unidad</p>
                  {item.originalUnitPrice > item.unitPrice && (
                    <p className="cart-savings">Ahorro ilustrativo: {currency.format((item.originalUnitPrice - item.unitPrice) * item.quantity)}</p>
                  )}
                  <button
                    className="flow-text-button"
                    type="button"
                    onClick={() => {
                      if (window.confirm(`¿Quitar ${item.name} del carrito?`)) removeItem(item.id);
                    }}
                  >
                    Quitar
                  </button>
                </div>
                <div className="quantity-control">
                  <label htmlFor={`quantity-${item.id}`}>Cantidad</label>
                  <span className="quantity-stepper">
                    <button aria-label={`Reducir cantidad de ${item.name}`} disabled={item.quantity <= 1} onClick={() => setQuantity(item.id, item.quantity - 1)} type="button">−</button>
                    <input id={`quantity-${item.id}`} min="1" max="99" type="number" value={item.quantity} onChange={(event) => setQuantity(item.id, Math.max(1, Number(event.target.value) || 1))} />
                    <button aria-label={`Aumentar cantidad de ${item.name}`} disabled={item.quantity >= 99} onClick={() => setQuantity(item.id, item.quantity + 1)} type="button">+</button>
                  </span>
                </div>
              </article>
            ))}
          </div>
          <section className="flow-card cart-summary">
            <p>Subtotal <strong>{currency.format(subtotal)}</strong></p>
            {savings > 0 && <p>Descuentos promocionales <strong>−{currency.format(savings)}</strong></p>}
            <p>Total provisional <strong>{currency.format(total)}</strong></p>
            <p className="flow-note">El total no incluye envío; las modalidades de retiro o recepción aún no están conectadas.</p>
            <Link className="flow-primary-link" href="/checkout">Continuar al checkout</Link>
          </section>
        </>
      )}
      </main>
    </>
  );
}
