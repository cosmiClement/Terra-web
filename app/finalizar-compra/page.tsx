"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";



const tiposDocumento = ["CI", "NIT", "Pasaporte"];

export default function FinalizarCompraPage() {

  const [tipoDoc, setTipoDoc] = useState("CI");
  const router = useRouter();


  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
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

          {/* ─── LEFT COLUMN: Mis datos ─────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Title + back link */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">Mis datos</h1>
              <Link
                href="/carrito"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Volver al carrito
              </Link>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {/* Nombre + Apellido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  id="nombre"
                  type="text"
                  placeholder="Nombre(s) *"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
                <input
                  id="apellido"
                  type="text"
                  placeholder="Apellido(s) *"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>

              {/* Teléfono */}
              <input
                id="telefono"
                type="tel"
                placeholder="Teléfono (sólo números) *"
                required
                pattern="[0-9]+"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />

              {/* Correo + NIT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  id="correo"
                  type="email"
                  placeholder="Correo (opcional)"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
                <input
                  id="nit"
                  type="text"
                  placeholder="Número de CI, NIT y razón social (opcional)"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>

              {/* Tipo de documento */}
              <div className="relative">
                <label className="block text-xs text-gray-500 mb-1 ml-1">
                  Tipo de documento (opcional)
                </label>
                <div className="relative">
                  <select
                    id="tipo-documento"
                    value={tipoDoc}
                    onChange={(e) => setTipoDoc(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-white"
                  >
                    {tiposDocumento.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>


            </form>
          </div>

          {/* ─── RIGHT COLUMN: Envío + Pago ─────────────────────────────────── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">

              {/* ENVÍO */}
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-3">
                  Envío
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-medium text-gray-800">Recogida local</span>{" "}
                  |{" "}
                  <span className="text-blue-600">
                    Realiza tu compra online y recógelo en tu tienda más cercana.
                  </span>{" "}
                  Entraremos en contacto para coordinar tu visita.{" "}
                  <span className="text-blue-600">
                    El monto mínimo para acceder al envío gratuito es de Bs. 1000.
                  </span>
                </p>
              </div>

              <hr className="border-gray-200" />

              {/* TOTAL */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-widest text-gray-700">
                  Total
                </span>
                <span className="text-base font-bold text-gray-900">Bs. 990</span>
              </div>



              {/* BOTÓN REALIZAR PEDIDO */}
              <button
                id="btn-realizar-pedido"
                type="button"
                onClick={() => router.push("/pedido-confirmado")}
                className="w-full bg-blue-800 hover:bg-blue-900 active:scale-[0.98] text-white font-semibold py-3 rounded-md text-sm tracking-wide transition-all duration-150"
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
