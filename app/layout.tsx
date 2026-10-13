import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartPanel, CartProvider } from "@/modules/cart";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Terra Autoservicio | Colchones y muebles",
  description: "Encuentra colchones, camas y muebles para renovar tu descanso.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
          <CartPanel />
        </CartProvider>
      </body>
    </html>
  );
}
