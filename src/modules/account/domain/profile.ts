import type { Result } from "@/modules/shared";

export type CustomerProfile = {
  name: string;
  email: string;
};

export function validateProfile(profile: CustomerProfile): Result<CustomerProfile> {
  const name = profile.name.trim();
  const email = profile.email.trim();

  if (!name) {
    return { ok: false, error: "Escribe tu nombre." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Escribe un correo electrónico válido." };
  }

  return { ok: true, value: { name, email } };
}
