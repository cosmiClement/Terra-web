"use client";

import Image from "next/image";
import Link from "next/link";

export default function PedidoConfirmadoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">

      {/* ── Barra superior verde/amarilla ── */}
      <div className="h-3 w-full bg-gradient-to-r from-yellow-400 via-green-500 to-green-600" />

      {/* ── Encabezado con logo ── */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <Image
            src="https://terracolchonesymuebles.online/catalogo/logo.jpg"
            alt="Terra Colchones y Muebles"
            width={140}
            height={50}
            className="h-14 w-auto object-contain"
            priority
          />
        </div>
      </header>

      {/* ── Contenido principal ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 gap-4">

        {/* Card: ¡Listo, compraste! */}
        <div className="w-full max-w-xl bg-white rounded-xl shadow-sm border border-gray-200 px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">¡Listo, compraste!</h1>
          <div className="flex-shrink-0 w-14 h-14 rounded-full border-2 border-green-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Card: Código de pedido */}
        <div className="w-full max-w-xl bg-white rounded-xl shadow-sm border border-gray-200 px-8 py-6">
          <p className="text-sm text-gray-500 mb-1">Tu código de pedido</p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-4xl font-bold tracking-widest text-gray-900 font-mono">
              34XFG3
            </span>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all duration-150 shadow-sm whitespace-nowrap">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir ticket
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-500 leading-relaxed">
            Presenta este código en caja para realizar tu pago y coordinar la entrega de tu pedido.
          </p>
        </div>

        {/* Card: Contactar al vendedor */}
        <div className="w-full max-w-xl bg-white rounded-xl shadow-sm border border-gray-200 px-8 py-6">
          <div className="flex items-start gap-4">
            {/* Ícono de producto placeholder */}
            <div className="flex-shrink-0 w-14 h-14 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
                />
              </svg>
            </div>

            {/* Texto */}
            <div className="flex-2 min-w-0">
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                Escríbele al vendedor para coordinar la entrega y el pago
              </p>
              
            </div>
          </div>

          {/* Botones */}
          <div className="mt-5">
            <Link
              href="/"
              id="btn-mis-compras"
              className="relative flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-sm font-bold px-6 py-3.5 rounded-lg transition-all duration-150 shadow-md shadow-green-200 ring-2 ring-green-400 ring-offset-2 animate-pulse"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Ir a Mis compras
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Botón Imprimir */}
        </div>

      </main>

    </div>
  );
}
