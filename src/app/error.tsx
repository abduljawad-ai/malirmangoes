"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: "400px",
          background: "#FFF5F5",
          border: "1px solid #FED7D7",
          borderRadius: "24px",
          padding: "48px 32px",
        }}
      >
        <motion.div
          style={{
            width: "80px",
            height: "80px",
            background: "#FED7D7",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span style={{ fontSize: "40px" }}>⚠️</span>
        </motion.div>

        <h1
          style={{
            fontFamily: "var(--font-heading), serif",
            fontSize: "24px",
            fontWeight: 700,
            color: "#742A2A",
            marginBottom: "12px",
          }}
        >
          Something Went Wrong
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "#9B2C2C",
            marginBottom: "24px",
            lineHeight: 1.6,
          }}
        >
          We apologize for the inconvenience. Our team has been notified and we&apos;re working to fix this.
        </p>

        {error?.digest && (
          <p
            style={{
              fontSize: "11px",
              color: "#C53030",
              fontFamily: "monospace",
              marginBottom: "24px",
            }}
          >
            Error ID: {error.digest}
          </p>
        )}

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#E53E3E",
              color: "white",
              padding: "12px 24px",
              borderRadius: "50px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <RefreshCw size={16} />
            Try Again
          </motion.button>

          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "white",
              color: "#E53E3E",
              padding: "12px 24px",
              borderRadius: "50px",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "14px",
              border: "1px solid #FED7D7",
            }}
          >
            <Home size={16} />
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
