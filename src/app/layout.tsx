import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { CartProvider } from "@/lib/CartContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Malir Mangoes | Premium Pakistani Mangoes Delivered Fresh",
  description:
    "Order fresh farm-grown premium Pakistani mangoes — Sindhri, Chaunsa, Anwar Ratol & more. 10kg wooden boxes, delivered via Leopard Courier across Karachi & all of Pakistan.",
  keywords: [
    "buy mangoes online Pakistan",
    "fresh mangoes Karachi",
    "Sindhri mango",
    "Chaunsa mango",
    "mango delivery Pakistan",
    "Malir mangoes",
    "Pakistani mangoes",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://malirmangoes.vercel.app"),
  openGraph: {
    title: "Malir Mangoes | Premium Pakistani Mangoes",
    description:
      "Order fresh farm-grown premium mangoes from our farm to your doorstep. Sindhri, Chaunsa, Anwar Ratol & more.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://malirmangoes.vercel.app",
    siteName: "Malir Mangoes",
    locale: "en_PK",
    images: [
      {
        url: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Fresh Pakistani Mangoes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Malir Mangoes | Premium Pakistani Mangoes",
    description:
      "Order fresh farm-grown premium mangoes from our farm to your doorstep.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${playfairDisplay.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="https://images.unsplash.com/photo-1553279768-865429fa0078?w=1400&q=85" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "Malir Mangoes",
                url: process.env.NEXT_PUBLIC_SITE_URL || "https://malirmangoes.vercel.app",
                description: "Premium Pakistani mango farm delivering fresh Sindhri, Chaunsa, Anwar Ratol & Langra mangoes nationwide via Leopard Courier.",
                image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=1200&q=80",
                contactPoint: { "@type": "ContactPoint", telephone: "+92-300-1234567", contactType: "sales", availableLanguage: ["en", "ur"] },
                address: { "@type": "PostalAddress", addressLocality: "Mirpurkhas", addressRegion: "Sindh", addressCountry: "PK" },
              },
              {
                "@type": "WebSite",
                name: "Malir Mangoes",
                url: process.env.NEXT_PUBLIC_SITE_URL || "https://malirmangoes.vercel.app",
                potentialAction: {
                  "@type": "SearchAction",
                  target: { "@type": "EntryPoint", urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://malirmangoes.vercel.app"}/?search={search_term_string}` },
                  "query-input": "required name=search_term_string",
                },
              },
            ],
          }),
        }} />
      </head>
      <body style={{ fontFamily: "var(--font-body), sans-serif" }}>
        <CartProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </CartProvider>
      </body>
    </html>
  );
}
