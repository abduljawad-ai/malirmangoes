import type { Metadata } from "next";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Mango Farm Pakistan | Fresh Premium Mangoes Delivered",
  description:
    "Order fresh farm-grown premium Pakistani mangoes — Sindhri, Chaunsa, Anwar Ratol & more. 10kg wooden boxes, delivered via Leopard Courier across Karachi & all of Pakistan.",
  keywords: ["buy mangoes online Pakistan", "fresh mangoes Karachi", "Sindhri mango", "Chaunsa mango", "mango delivery Pakistan"],
  openGraph: {
    title: "Mango Farm Pakistan | Fresh Premium Mangoes",
    description: "Order fresh farm-grown premium mangoes from our farm to your doorstep.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
