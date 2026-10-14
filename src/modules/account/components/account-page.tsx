"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { StoreHeader } from "@/components/layout";
import {
  getAccessToken,
  getCustomerProfile,
  createCustomerAddress,
  listCustomerAddresses,
  listMyOrders,
  signIn,
  signOut,
  updateCustomerProfile,
  type ApiOrder,
  type CustomerAddress,
  type CustomerProfile,
} from "@/lib/api/catalog-api";

export function AccountPage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  async function loadAccount() {
    if (!getAccessToken()) {
      setAuthenticated(false);
      setProfile(null);
      return;
    }
    setAuthenticated(true);
    setLoading(true);
    setError("");
    try {
      const [customer, customerAddresses, customerOrders] = await Promise.all([
        getCustomerProfile(),
        listCustomerAddresses(),
        listMyOrders(),
      ]);
      setProfile(customer);
      setAddresses(customerAddresses);
      setOrders(customerOrders);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo cargar la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void loadAccount(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    setLoading(true);
    try {
      await signIn(String(form.get("email") ?? ""), String(form.get("password") ?? ""));
      await loadAccount();
      setMessage("Sesión iniciada correctamente.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo iniciar sesión.");
      setLoading(false);
    }
  }

  async function handleProfileSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    try {
      const updated = await updateCustomerProfile({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
      });
      setProfile(updated);
      setMessage("Perfil actualizado.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo guardar el perfil.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddressSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setLoading(true);
    setError("");
    try {
      const address = await createCustomerAddress({
        label: String(form.get("label") ?? ""),
        address: String(form.get("address") ?? ""),
        city: String(form.get("city") ?? ""),
        reference: String(form.get("reference") ?? ""),
        is_default: form.get("is_default") === "on",
      });
      setAddresses((current) => [...current.filter((entry) => !address.is_default || !entry.is_default), address]);
      formElement.reset();
      setMessage("Dirección guardada.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo guardar la dirección.");
    } finally {
      setLoading(false);
    }
  }

  function handleSignOut() {
    signOut();
    setAuthenticated(false);
    setProfile(null);
    setAddresses([]);
    setOrders([]);
    setMessage("Sesión cerrada.");
  }

  return (
    <>
      <StoreHeader />
      <main className="flow-page">
        <Link className="flow-back-link" href="/">← Volver a la tienda</Link>
        <h1>Mi cuenta</h1>
        {!authenticated ? (
          <form className="flow-card flow-form" onSubmit={handleSignIn}>
            <h2>Iniciar sesión</h2>
            <p>Accede para consultar tus pedidos, direcciones y carrito guardado.</p>
            <label>Correo electrónico<input autoComplete="email" name="email" required type="email" /></label>
            <label>Contraseña<input autoComplete="current-password" name="password" required type="password" /></label>
            {error && <p className="flow-error" role="alert">{error}</p>}
            {message && <p className="flow-success" role="status">{message}</p>}
            <button className="flow-primary-button" disabled={loading} type="submit">{loading ? "Ingresando…" : "Iniciar sesión"}</button>
            <p className="flow-note">La creación de cuentas se realiza desde Supabase Auth o el flujo de registro que habilite la tienda.</p>
          </form>
        ) : (
          <div className="checkout-layout">
            <form className="flow-card flow-form" onSubmit={handleProfileSave}>
              <div className="section-heading">
                <h2>Perfil</h2>
                <button className="flow-text-button" onClick={handleSignOut} type="button">Cerrar sesión</button>
              </div>
              <label>Nombre<input autoComplete="name" defaultValue={profile?.name ?? ""} name="name" required /></label>
              <label>Correo electrónico<input autoComplete="email" defaultValue={profile?.email ?? ""} name="email" required type="email" /></label>
              <label>Teléfono<input autoComplete="tel" defaultValue={profile?.phone ?? ""} name="phone" type="tel" /></label>
              {error && <p className="flow-error" role="alert">{error}</p>}
              {message && <p className="flow-success" role="status">{message}</p>}
              <button className="flow-primary-button" disabled={loading} type="submit">Guardar perfil</button>
              <section>
                <h2>Direcciones guardadas</h2>
                {addresses.length ? addresses.map((address) => (
                  <p key={address.id}>{address.label}: {address.address}, {address.city}{address.is_default ? " · Predeterminada" : ""}</p>
                )) : <p className="flow-note">Aún no tienes direcciones guardadas.</p>}
                <form className="flow-form" onSubmit={handleAddressSave}>
                  <label>Etiqueta<input name="label" placeholder="Casa" required /></label>
                  <label>Dirección<input autoComplete="street-address" name="address" required /></label>
                  <label>Ciudad<input name="city" required /></label>
                  <label>Referencia<textarea name="reference" rows={2} /></label>
                  <label className="guest-checkout-option"><input name="is_default" type="checkbox" /> Usar como predeterminada</label>
                  <button className="secondary-action" disabled={loading} type="submit">Agregar dirección</button>
                </form>
              </section>
            </form>
            <section className="flow-card">
              <h2>Mis pedidos</h2>
              {orders.length ? orders.map((order) => (
                <article className="ticket-line" key={order.id}>
                  <span>{order.ticket_number ?? order.id} · {order.status}</span>
                  <strong>{new Intl.NumberFormat("es-BO", { style: "currency", currency: "BOB", maximumFractionDigits: 0 }).format(Number(order.total_minor) / 100)}</strong>
                </article>
              )) : <p className="flow-note">No tienes pedidos todavía.</p>}
            </section>
          </div>
        )}
      </main>
    </>
  );
}
