"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/modules/cart/application/cart-context";

const tiposDocumento = ["CI", "NIT", "Pasaporte"];

const currency = new Intl.NumberFormat("es-BO", {
  style: "currency",
  currency: "BOB",
  maximumFractionDigits: 0,
});
const inputClass =
  "w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-terra-ink placeholder-slate-400 bg-white outline-none focus:border-terra-red focus:ring-2 focus:ring-red-100 transition";

export default function FinalizarCompraPage() {
  const [tipoDoc, setTipoDoc] = useState("CI");
  const router = useRouter();
  const { items, total } = useCart();

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <Image
            src="https://terracolchonesymuebles.online/catalogo/logo.jpg"
            alt="Terra Colchones y Muebles"
            width={140}
            height={50}
            className="h-18 w-auto object-contain"
            priority
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Columna izquierda: Mis datos ── */}
          <div className="flex-1 min-w-0">

            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black tracking-tight text-terra-navy">
                Mis datos
              </h1>
              <Link
                href="/carrito"
                className="text-sm font-bold text-terra-red hover:text-terra-red-dark flex items-center gap-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Volver al carrito
              </Link>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

              {/* Nombre + Apellido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input id="nombre" type="text" placeholder="Nombre(s) *" required className={inputClass} />
                <input id="apellido" type="text" placeholder="Apellido(s) *" required className={inputClass} />
              </div>

              {/* Teléfono */}
              <input
                id="telefono"
                type="tel"
                placeholder="Teléfono (sólo números) *"
                required
                pattern="[0-9]+"
                className={inputClass}
              />

              {/* Correo + NIT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input id="correo" type="email" placeholder="Correo (opcional)" className={inputClass} />
                <input id="nit" type="text" placeholder="Número de CI, NIT y razón social (opcional)" className={inputClass} />
              </div>

              {/* Tipo de documento */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 ml-0.5">
                  Tipo de documento (opcional)
                </label>
                <div className="relative">
                  <select
                    id="tipo-documento"
                    value={tipoDoc}
                    onChange={(e) => setTipoDoc(e.target.value)}
                    className={`${inputClass} appearance-none`}
                  >
                    {tiposDocumento.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* ── Columna derecha: Resumen ── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">

              {/* Envío */}
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-terra-navy mb-3">
                  Envío
                </h2>
                <p className="text-sm text-terra-ink leading-relaxed">
                  <span className="font-bold">Recogida local</span>{" "}|{" "}
                  <span className="text-terra-red">
                    Realiza tu compra online y recógelo en tu tienda más cercana.
                  </span>{" "}
                  Entraremos en contacto para coordinar tu visita.{" "}
                  <span className="text-terra-red">
                    El monto mínimo para acceder al envío gratuito es de Bs. 1000.
                  </span>
                </p>
              </div>

              <hr className="border-slate-200" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-terra-navy">
                  Total
                </span>
                <span className="text-base font-black text-terra-navy">{currency.format(total)}</span>
              </div>

              {/* Botón */}
              <button
                id="btn-realizar-pedido"
                type="button"
                onClick={() => router.push("/pedido-confirmado")}
                className="w-full bg-terra-red hover:bg-terra-red-dark active:scale-[0.98] text-white font-extrabold py-3.5 rounded-xl text-sm tracking-wide transition-all duration-150 shadow-sm shadow-red-200"
              >
                Realizar el pedido
              </button>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
