"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "../application/cart-context";

const currency = new Intl.NumberFormat("es-BO", {
  style: "currency",
  currency: "BOB",
  maximumFractionDigits: 0,
});

export function CartPanel() {
  const { items, count, subtotal, savings, total, isPanelOpen, closeCartPanel, removeItem, setQuantity } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isPanelOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isPanelOpen]);

  if (!isPanelOpen) return null;

  return (
    <>
      <button
        aria-label="Cerrar resumen del carrito"
        className="cart-panel-backdrop"
        onClick={closeCartPanel}
        tabIndex={-1}
        type="button"
      />
      <aside
        aria-labelledby="cart-panel-title"
        aria-modal="true"
        className="cart-panel"
        onKeyDown={(event) => {
          if (event.key === "Escape") closeCartPanel();
        }}
        role="dialog"
      >
        <header className="cart-panel-header">
          <div className="cart-panel-heading">
            <h2 id="cart-panel-title">Tu carrito</h2>
            <p>{count} {count === 1 ? "producto" : "productos"}</p>
          </div>
          <button
            aria-label="Cerrar carrito"
            className="cart-panel-close"
            onClick={closeCartPanel}
            ref={closeButtonRef}
            type="button"
          >
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart-panel-empty">
            <strong>Tu carrito está vacío</strong>
            <p>Explora el catálogo y agrega productos para continuar.</p>
            <Link href="/catalog" onClick={closeCartPanel}>Explorar productos</Link>
          </div>
        ) : (
          <>
            <ul aria-label="Productos en el carrito" className="cart-panel-items">
              {items.map((item) => (
                <li className="cart-panel-item" key={item.id}>
                  <Image
                    alt={item.name}
                    className="cart-panel-item-image"
                    height={80}
                    src={item.image}
                    width={80}
                  />
                  <div className="cart-panel-item-details">
                    <div className="cart-panel-item-title-row">
                      <span className="cart-panel-item-title">{item.name}</span>
                      <button
                        aria-label={`Quitar ${item.name} del carrito`}
                        className="cart-panel-remove"
                        onClick={() => removeItem(item.id)}
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                    {item.reference && <p className="cart-panel-item-model">Modelo {item.reference}</p>}
                    <div className="cart-panel-item-bottom">
                      <div aria-label={`Cantidad de ${item.name}`} className="cart-panel-stepper">
                        <button
                          aria-label={`Reducir cantidad de ${item.name}`}
                          disabled={item.quantity <= 1}
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          type="button"
                        >
                          −
                        </button>
                        <input
                          aria-label={`Cantidad de ${item.name}`}
                          max="99"
                          min="1"
                          onChange={(event) => setQuantity(item.id, Math.max(1, Number(event.target.value) || 1))}
                          type="number"
                          value={item.quantity}
                        />
                        <button
                          aria-label={`Aumentar cantidad de ${item.name}`}
                          disabled={item.quantity >= 99}
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                      <strong className="cart-panel-item-price">{currency.format(item.unitPrice * item.quantity)}</strong>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="cart-panel-footer">
              <p className="cart-panel-subtotal"><span>Subtotal</span><strong>{currency.format(subtotal)}</strong></p>
              {savings > 0 && (
                <p className="cart-panel-subtotal"><span>Descuentos</span><strong>−{currency.format(savings)}</strong></p>
              )}
              {savings > 0 && (
                <p className="cart-panel-subtotal"><span>Total provisional</span><strong>{currency.format(total)}</strong></p>
              )}
              <nav aria-label="Acciones del carrito" className="cart-panel-actions">
                <Link className="cart-panel-view-cart" href="/cart" onClick={closeCartPanel}>Ver carrito</Link>
                <Link className="cart-panel-checkout" href="/finalizar-compra" onClick={closeCartPanel}>Finalizar compra</Link>
              </nav>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}