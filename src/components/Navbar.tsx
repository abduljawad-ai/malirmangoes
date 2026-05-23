"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, ShoppingCart } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { useCart } from "@/lib/CartContext";

export default function Navbar({ farmName, logoUrl }: { farmName: string; logoUrl?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#varieties", label: "Our Mangoes" },
    { href: "#how-it-works", label: "How to Order" },
    { href: "#about", label: "Our Farm" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.3s ease",
        background: scrolled
          ? "rgba(253,250,244,0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(61,43,31,0.08)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,179,0,0.12)" : "none",
      }}
    >
      <nav
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          {logoUrl ? (
            <Image src={logoUrl} alt={farmName} width={36} height={36} style={{ objectFit: "contain", borderRadius: "8px" }} />
          ) : (
            <div style={{ background: "var(--mango-600)", padding: "6px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--bark-900)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            </div>
          )}
          <span
            style={{
              fontFamily: "var(--font-heading), serif",
              fontSize: "18px",
              fontWeight: 600,
              color: scrolled ? "var(--bark-900)" : "white",
              lineHeight: 1.2,
              transition: "color 0.3s ease",
            }}
          >
            {farmName}
          </span>
        </Link>

        <ul
          style={{
            display: "none",
            listStyle: "none",
            alignItems: "center",
            gap: "32px",
          }}
          className="desktop-nav"
        >
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: scrolled ? "var(--bark-700)" : "rgba(255,255,255,0.85)",
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--mango-700)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = scrolled ? "var(--bark-700)" : "rgba(255,255,255,0.85)")}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#varieties" className="btn-primary" style={{ padding: "10px 22px", fontSize: "14px" }}>
              <ShoppingBag size={16} />
              Order Now
            </a>
          </li>
          <li>
            <a
              href="#varieties"
              id="navbar-cart-badge"
              aria-label={`Cart: ${totalItems} items`}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: totalItems > 0 ? "var(--mango-50)" : "transparent",
                border: totalItems > 0 ? "1.5px solid var(--mango-300)" : "1.5px solid transparent",
                color: scrolled ? "var(--bark-900)" : "white",
                textDecoration: "none",
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    background: "var(--mango-600)",
                    color: "var(--bark-900)",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    fontSize: "10px",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                  }}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </a>
          </li>
        </ul>

        <button
          id="mobile-menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            color: scrolled ? "var(--bark-900)" : "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.3s ease",
          }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{
              background: "rgba(253,250,244,0.98)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(255,179,0,0.15)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "24px 20px 32px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  style={{
                    display: "block",
                    padding: "14px 16px",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--bark-900)",
                    textDecoration: "none",
                    borderRadius: "12px",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "var(--mango-50)")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "transparent")}
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="#varieties"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                className="btn-primary"
                style={{ marginTop: "16px", justifyContent: "center" }}
              >
                <WhatsAppIcon size={18} />
                Order Now via WhatsApp
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          #mobile-menu-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
