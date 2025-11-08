import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { Header } from "@/components/ecommerce/header";
import { Footer } from "@/components/ecommerce/footer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "E-Commerce App",
  description: "An e-commerce application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
