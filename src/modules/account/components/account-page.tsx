"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { saveProfile } from "../application/save-profile";
import { StoreHeader } from "@/components/layout";

export function AccountPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = saveProfile({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
    });

    if (!result.ok) {
      setError(result.error);
      setMessage("");
      return;
    }

    setError("");
    setMessage(`Datos listos para guardar para ${result.value.name}. La conexión de cuenta se integrará después.`);
  }

  return (
    <>
    <StoreHeader />
    <main className="flow-page">
      <Link className="flow-back-link" href="/">← Volver a la tienda</Link>
      <h1>Mi cuenta</h1>
      <form className="flow-card flow-form" onSubmit={handleSubmit}>
        <p>Completa tus datos de perfil.</p>
        <label>
          Nombre
          <input autoComplete="name" name="name" required />
        </label>
        <label>
          Correo electrónico
          <input autoComplete="email" name="email" required type="email" />
        </label>
        {error && <p className="flow-error" role="alert">{error}</p>}
        {message && <p className="flow-success" role="status">{message}</p>}
        <button className="flow-primary-button" type="submit">Guardar perfil</button>
        <p className="flow-note">El perfil todavía no se almacena en un servidor.</p>
      </form>
    </main>
    </>
  );
}
