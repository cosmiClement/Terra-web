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
        <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 20 20" width="18" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.25 8.125C16.25 9.91797 15.668 11.5742 14.6875 12.918L19.6328 17.8672C20.1211 18.3555 20.1211 19.1484 19.6328 19.6367C19.1445 20.125 18.3516 20.125 17.8633 19.6367L12.918 14.6875C11.5742 15.6719 9.91797 16.25 8.125 16.25C3.63672 16.25 0 12.6133 0 8.125C0 3.63672 3.63672 0 8.125 0C12.6133 0 16.25 3.63672 16.25 8.125ZM8.125 13.75C11.2314 13.75 13.75 11.2314 13.75 8.125C13.75 5.01855 11.2314 2.5 8.125 2.5C5.01855 2.5 2.5 5.01855 2.5 8.125C2.5 11.2314 5.01855 13.75 8.125 13.75Z"
            fill="#9CA3AF"
          />
        </svg>
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
