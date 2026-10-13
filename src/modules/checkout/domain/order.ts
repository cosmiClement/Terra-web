import type { CartLine } from "@/modules/cart";
import type { Result } from "@/modules/shared";

export type CheckoutDetails = {
  name: string;
  email: string;
  guest: boolean;
};

export type CheckoutReview = {
  details: CheckoutDetails;
  items: CartLine[];
  subtotal: number;
  savings: number;
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

  return { ok: true, value: { name, email, guest: details.guest } };
}
