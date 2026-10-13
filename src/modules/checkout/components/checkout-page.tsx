"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCart } from "@/modules/cart";
import { StoreHeader } from "@/components/layout";
import { storefrontPolicy } from "@/config/storefront";
import { prepareCheckout } from "../application/prepare-checkout";
import type { CheckoutReview } from "../domain/order";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [error, setError] = useState("");
  const [review, setReview] = useState<CheckoutReview | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = prepareCheckout(
      {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        guest: formData.get("guest") === "on",
      },
      items,
      storefrontPolicy.guestCheckoutAllowed,
    );

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setError("");
    setReview(result.value);
  }

  return (
    <>
      <StoreHeader />
      <main className="flow-page checkout-page">
        <Link className="flow-back-link" href={review ? "/cart" : "/cart"}>← Volver al carrito</Link>
        <ol className="checkout-steps" aria-label="Pasos de compra">
          <li className="is-current">Identificación</li>
          <li className={review ? "is-current" : ""}>Revisión</li>
          <li>Pago en tienda</li>
        </ol>
        <h1>{review ? "Revisa tu pedido" : "Identificación del cliente"}</h1>
        {items.length === 0 ? (
          <section className="flow-card">
            <p>Tu carrito está vacío. Agrega productos antes de continuar.</p>
            <Link className="flow-primary-link" href="/catalog">Explorar catálogo</Link>
          </section>
        ) : review ? (
          <div className="checkout-layout">
            <section className="flow-card review-card">
              <h2>Productos seleccionados</h2>
              {review.items.map((item) => (
                <div className="review-line" key={item.id}>
                  <span>{item.quantity} × {item.name}</span>
                  <strong>{currency.format(item.unitPrice * item.quantity)}</strong>
                </div>
              ))}
              <p>Cliente: {review.details.name} · {review.details.email}</p>
              <p className="flow-note">Retiro/recepción y métodos de pago aparecerán cuando estén configurados por la tienda.</p>
              <p className="flow-note">No se ha registrado ni confirmado ningún pedido.</p>
              <button className="flow-primary-button" disabled type="button">
                Continuar con pago (no conectado)
              </button>
              <button className="flow-text-button" type="button" onClick={() => setReview(null)}>Editar identificación</button>
            </section>
            <aside className="flow-card cart-summary">
              <h2>Resumen</h2>
              {review.savings > 0 && <p>Ahorro ilustrativo <strong>{currency.format(review.savings)}</strong></p>}
              <p>Subtotal <strong>{currency.format(review.subtotal)}</strong></p>
              <p className="flow-note">Los precios mostrados son de demostración.</p>
            </aside>
          </div>
        ) : (
          <div className="checkout-layout">
            <form className="flow-card flow-form" onSubmit={handleSubmit}>
              <p className="flow-note">La identificación de clientes y los beneficios especiales no están conectados. No se aplican descuentos de cliente.</p>
              <p>Los datos de contacto solo se usan en esta revisión de demostración; no se guardan ni envían.</p>
              <label>Nombre<input autoComplete="name" name="name" required /></label>
              <label>Correo electrónico<input autoComplete="email" name="email" required type="email" /></label>
              {storefrontPolicy.guestCheckoutAllowed && (
                <label className="guest-checkout-option">
                  <input name="guest" type="checkbox" /> Continuar como invitado
                </label>
              )}
              {error && <p className="flow-error" role="alert">{error}</p>}
              <button className="flow-primary-button" type="submit">Revisar pedido</button>
            </form>
            <aside className="flow-card cart-summary">
              <h2>Tu selección</h2>
              <p>{items.reduce((count, item) => count + item.quantity, 0)} artículos</p>
              <p>Subtotal <strong>{currency.format(subtotal)}</strong></p>
              <Link className="flow-text-button" href="/cart">Editar carrito</Link>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
