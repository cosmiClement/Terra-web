import type { Metadata } from "next";
import { CartProvider } from "@/modules/cart";
import "./globals.css";

export const metadata: Metadata = {
  title: "Terra Autoservicio | Colchones y muebles",
  description: "Encuentra colchones, camas y muebles para renovar tu descanso.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
