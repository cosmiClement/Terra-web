"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { useCart } from "@/modules/cart";
import { StoreHeader } from "@/components/layout";
import { storefrontPolicy } from "@/config/storefront";
import { createOrderTicket, prepareCheckout } from "../application/prepare-checkout";
import type { CheckoutReview, OrderTicket } from "../domain/order";

const currency = new Intl.NumberFormat("es-BO", {
  style: "currency",
  currency: "BOB",
  maximumFractionDigits: 0,
});

const dateTime = new Intl.DateTimeFormat("es-BO", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function CheckoutPage() {
  const { items, subtotal, savings, total, clearCart } = useCart();
  const [error, setError] = useState("");
  const [review, setReview] = useState<CheckoutReview | null>(null);
  const [ticket, setTicket] = useState<OrderTicket | null>(null);
  const [fulfillment, setFulfillment] = useState<"store-pickup" | "home-delivery">("store-pickup");
  const creatingTicket = useRef(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = prepareCheckout(
      {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        address: String(formData.get("address") ?? ""),
        fulfillment,
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

  function handleGenerateTicket() {
    if (!review || creatingTicket.current) return;

    const confirmed = window.confirm(
      "Se generará un ticket de solicitud pendiente. No confirma una venta ni un pago. ¿Deseas continuar?",
    );

    if (!confirmed) return;

    creatingTicket.current = true;
    const newTicket = createOrderTicket(review);
    setTicket(newTicket);
    clearCart();
  }

  return (
    <>
      <StoreHeader />
      <main className="flow-page checkout-page">
        {!ticket && <Link className="flow-back-link" href="/cart">← Volver al carrito</Link>}
        {!ticket && (
          <ol className="checkout-steps" aria-label="Pasos de compra">
            <li className={!review ? "is-current" : "is-complete"}>Datos y entrega</li>
            <li className={review ? "is-current" : ""}>Revisión</li>
            <li>Ticket de solicitud</li>
          </ol>
        )}

        {ticket ? (
          <section className="ticket-screen">
            <article className="flow-card print-ticket" aria-labelledby="ticket-title">
              <header className="ticket-header">
                <p className="eyebrow">COLCHONES Y MUEBLES</p>
                <h1 id="ticket-title">TERRA AUTOSERVICIO</h1>
                <p>Ticket de solicitud de compra</p>
              </header>
              <div className="ticket-status">
                <strong>PENDIENTE DE CONFIRMACIÓN EN TIENDA</strong>
                <span>Folio local: {ticket.folio}</span>
                <span>{dateTime.format(new Date(ticket.createdAt))}</span>
              </div>
              <section className="ticket-section">
                <h2>Datos de contacto</h2>
                <p>{ticket.details.name}</p>
                <p>{ticket.details.email}</p>
                <p>
                  Modalidad solicitada: {ticket.details.fulfillment === "store-pickup" ? "Retiro en tienda" : "Entrega a domicilio"}
                </p>
                {ticket.details.fulfillment === "home-delivery" && <p>Dirección solicitada: {ticket.details.address}</p>}
                <p className="flow-note">La modalidad queda sujeta a disponibilidad y confirmación del personal.</p>
              </section>
              <section className="ticket-section">
                <h2>Artículos</h2>
                {ticket.items.map((item) => (
                  <div className="ticket-line" key={item.id}>
                    <span>{item.quantity} × {item.name}</span>
                    <strong>{currency.format(item.unitPrice * item.quantity)}</strong>
                  </div>
                ))}
              </section>
              <section className="ticket-totals">
                <p>Subtotal <strong>{currency.format(ticket.subtotal)}</strong></p>
                {ticket.savings > 0 && <p>Descuentos promocionales <strong>−{currency.format(ticket.savings)}</strong></p>}
                <p className="ticket-total">Total estimado <strong>{currency.format(ticket.total)}</strong></p>
              </section>
              <p className="ticket-disclaimer">
                Este comprobante es una solicitud local de demostración. No es factura, no acredita pago,
                no reserva inventario y no confirma una venta. Presenta este ticket al personal para verificar
                precios, disponibilidad y condiciones antes de pagar.
              </p>
            </article>
            <div className="ticket-actions">
              <button className="flow-primary-button" onClick={() => window.print()} type="button">Imprimir ticket</button>
              <Link className="secondary-action" href="/catalog">Iniciar otra compra</Link>
              <p className="flow-note">El ticket se conserva en esta pantalla mientras no la cierres o recargues.</p>
            </div>
          </section>
        ) : items.length === 0 ? (
          <section className="flow-card">
            <h1>Tu carrito está vacío</h1>
            <p>Agrega productos antes de preparar el ticket de solicitud.</p>
            <Link className="flow-primary-link" href="/catalog">Explorar catálogo</Link>
          </section>
        ) : review ? (
          <div className="checkout-layout">
            <section className="flow-card review-card">
              <h1>Revisa tu solicitud</h1>
              {review.items.map((item) => (
                <div className="review-line" key={item.id}>
                  <span>{item.quantity} × {item.name}</span>
                  <strong>{currency.format(item.unitPrice * item.quantity)}</strong>
                </div>
              ))}
              <div className="review-contact">
                <p><strong>Cliente:</strong> {review.details.name} · {review.details.email}</p>
                <p><strong>Modalidad solicitada:</strong> {review.details.fulfillment === "store-pickup" ? "Retiro en tienda" : "Entrega a domicilio"}</p>
                {review.details.fulfillment === "home-delivery" && <p><strong>Dirección:</strong> {review.details.address}</p>}
              </div>
              <p className="flow-note">La disponibilidad, el costo de entrega y los medios de pago deben confirmarse con el personal de tienda.</p>
              <p className="flow-note">Los datos y precios de esta demostración no se envían ni se guardan en un servidor.</p>
              <button className="flow-primary-button" onClick={handleGenerateTicket} type="button">
                Confirmar datos y generar ticket
              </button>
              <button className="flow-text-button" onClick={() => setReview(null)} type="button">Editar datos</button>
            </section>
            <aside className="flow-card cart-summary">
              <h2>Resumen</h2>
              <p>Subtotal <strong>{currency.format(review.subtotal)}</strong></p>
              {review.savings > 0 && <p>Descuentos <strong>−{currency.format(review.savings)}</strong></p>}
              <p>Total estimado <strong>{currency.format(review.total)}</strong></p>
              <p className="flow-note">Total estimado antes de entrega. Precios de demostración.</p>
            </aside>
          </div>
        ) : (
          <div className="checkout-layout">
            <form className="flow-card flow-form" onSubmit={handleSubmit}>
              <h1>Datos del cliente y entrega</h1>
              <p className="flow-note">La identificación y los beneficios de cliente no están conectados. No se aplican descuentos de cliente.</p>
              <p>Los datos ingresados solo se usan para generar el ticket local; no se guardan ni se envían.</p>
              <label>Nombre<input autoComplete="name" name="name" required /></label>
              <label>Correo electrónico<input autoComplete="email" name="email" required type="email" /></label>
              {storefrontPolicy.guestCheckoutAllowed && (
                <label className="guest-checkout-option">
                  <input name="guest" type="checkbox" /> Continuar como invitado
                </label>
              )}
              <fieldset className="fulfillment-options">
                <legend>Modalidad que solicitas</legend>
                <label>
                  <input checked={fulfillment === "store-pickup"} name="fulfillment" onChange={() => setFulfillment("store-pickup")} type="radio" />
                  Retiro en tienda <span>(a confirmar)</span>
                </label>
                <label>
                  <input checked={fulfillment === "home-delivery"} name="fulfillment" onChange={() => setFulfillment("home-delivery")} type="radio" />
                  Entrega a domicilio <span>(cobertura y costo a confirmar)</span>
                </label>
              </fieldset>
              {fulfillment === "home-delivery" && (
                <label>Dirección solicitada<textarea autoComplete="street-address" name="address" required rows={3} /></label>
              )}
              {error && <p className="flow-error" role="alert">{error}</p>}
              <button className="flow-primary-button" type="submit">Revisar solicitud</button>
            </form>
            <aside className="flow-card cart-summary">
              <h2>Tu selección</h2>
              <p>{items.reduce((count, item) => count + item.quantity, 0)} artículos</p>
              <p>Subtotal <strong>{currency.format(subtotal)}</strong></p>
              {savings > 0 && <p>Descuentos <strong>−{currency.format(savings)}</strong></p>}
              <p>Total estimado <strong>{currency.format(total)}</strong></p>
              <Link className="flow-text-button" href="/cart">Editar carrito</Link>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
