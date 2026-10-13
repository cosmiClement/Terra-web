"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/modules/cart";

export function StoreHeader() {
  const { count } = useCart();

  return (
    <header className="store-header store-header--global">
      <Link className="brand-lockup" href="/" aria-label="Terra Autoservicio, inicio">
        <span className="brand-mark">
          <span className="brand-letter">T</span>
        </span>
        <span className="brand-copy">
          <strong>COLCHONES Y MUEBLES</strong>
          <span>TERRA AUTOSERVICIO</span>
        </span>
      </Link>
      <form className="store-search" action="/catalog" role="search">
        <Image src="/icons/search-proper.svg" alt="" width={20} height={20} />
        <input aria-label="Buscar productos" name="q" placeholder="Buscar productos" type="search" />
        <button type="submit">Buscar</button>
      </form>
        <nav className="header-actions" aria-label="Accesos de la tienda">
          <Link className="header-catalog-link" href="/catalog">Catálogo</Link>
        <Link className="cart-link" href="/cart" aria-label={`Carrito: ${count} ${count === 1 ? "producto" : "productos"}`}>
          <Image src="/icons/cart-proper.svg" alt="" width={20} height={20} />
          <span aria-live="polite" className="cart-count">{count}</span>
        </Link>
      </nav>
    </header>
  );
}
