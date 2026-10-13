"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/modules/cart";

export function StoreHeader() {
  const { count, clearCart } = useCart();
  const router = useRouter();

  function handleResetSession() {
    if (window.confirm("¿Quieres vaciar el carrito e iniciar una sesión nueva?")) {
      clearCart();
      router.replace("/");
    }
  }

  return (
    <header className="store-header store-header--global">
      <Link className="brand-lockup" href="/" aria-label="Terra Autoservicio, inicio">
        <span className="brand-mark">
          <Image
            src="https://terracolchonesymuebles.online/catalogo/logo.jpg"
            alt="Terra Colchones y Muebles"
            width={80}
            height={80}
            priority
          />
        </span>
        <span className="brand-copy">
          <strong>COLCHONES Y MUEBLES</strong>
          <span>TERRA AUTOSERVICIO</span>
        </span>
      </Link>
      <form className="store-search" action="/catalog" role="search">
        <Image src="/icons/search.svg" alt="" width={18} height={18} />
        <input aria-label="Buscar productos" name="q" placeholder="Buscar productos" type="search" />
        <button type="submit">Buscar</button>
      </form>
      <nav className="header-actions" aria-label="Accesos de la tienda">
        <Link className="header-catalog-link" href="/catalog">Catálogo</Link>
        <button className="reset-session-button" onClick={handleResetSession} type="button">
          Reiniciar
        </button>
        <Link className="cart-link" href="/cart" aria-label={`Carrito: ${count} ${count === 1 ? "producto" : "productos"}`}>
          <Image src="/icons/cart.svg" alt="" width={20} height={20} />
          <span aria-live="polite" className="cart-count">{count}</span>
        </Link>
      </nav>
    </header>
  );
}
