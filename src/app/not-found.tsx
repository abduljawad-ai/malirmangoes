import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
        fontFamily: "var(--font-body), sans-serif",
        background: "var(--cream)",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          background: "var(--white)",
          borderRadius: "24px",
          padding: "48px 32px",
          boxShadow: "0 8px 32px var(--shadow-warm)",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "var(--mango-50)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <span style={{ fontSize: "40px" }}>🥭</span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-heading), serif",
            fontSize: "28px",
            fontWeight: 700,
            color: "var(--bark-900)",
            marginBottom: "12px",
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: "var(--bark-400)",
            marginBottom: "32px",
            lineHeight: 1.6,
          }}
        >
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--mango-600)",
              color: "var(--bark-900)",
              padding: "12px 24px",
              borderRadius: "50px",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "14px",
              transition: "background 0.2s",
            }}
          >
            <Home size={16} />
            Go Home
          </Link>

          <Link
            href="/#varieties"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--cream-dark)",
              color: "var(--bark-700)",
              padding: "12px 24px",
              borderRadius: "50px",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "14px",
              transition: "background 0.2s",
            }}
          >
            <Search size={16} />
            Browse Mangoes
          </Link>
        </div>
      </div>
    </div>
  );
}
