import type { CartLine } from "@/modules/cart";
import type { Result } from "@/modules/shared";

export type CheckoutDetails = {
  name: string;
  email: string;
  address: string;
  fulfillment: "store-pickup" | "home-delivery";
  guest: boolean;
};

export type CheckoutReview = {
  details: CheckoutDetails;
  items: CartLine[];
  subtotal: number;
  savings: number;
  total: number;
};

export type OrderTicket = CheckoutReview & {
  folio: string;
  createdAt: string;
};

export function validateCheckoutDetails(
  details: CheckoutDetails,
  guestCheckoutAllowed: boolean,
): Result<CheckoutDetails> {
  const name = details.name.trim();
  const email = details.email.trim();

  if (details.guest && !guestCheckoutAllowed) {
    return { ok: false, error: "La opción de invitado no está habilitada por la tienda." };
  }

  if (!name) {
    return { ok: false, error: "Escribe tu nombre." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Escribe un correo electrónico válido." };
  }

  const address = details.address.trim();

  if (details.fulfillment === "home-delivery" && !address) {
    return { ok: false, error: "Escribe la dirección solicitada para la entrega a domicilio." };
  }

  return {
    ok: true,
    value: { name, email, address, fulfillment: details.fulfillment, guest: details.guest },
  };
}
