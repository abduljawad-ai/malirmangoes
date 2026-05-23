"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ImageWithFallback from "@/components/ImageWithFallback";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { DEMO_SETTINGS, DEMO_PRODUCTS, Product, SiteSettings } from "@/lib/types";
import { getProducts, getSettings } from "@/lib/store";
import { Truck, Package, ShieldCheck, Star, Leaf, MapPin, ShoppingBag, Phone } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

function LoadingSkeleton() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#1d140a", color: "#fff" }}>
      <motion.div
        style={{ textAlign: "center" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          style={{ fontSize: "56px", marginBottom: "16px", display: "inline-block" }}
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          🥭
        </motion.div>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", letterSpacing: "0.06em" }}>Loading farm-fresh goodness...</p>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [s, p] = await Promise.all([getSettings(), getProducts()]);
        setSettings(s);
        setProducts(p);
      } catch (e) {
        console.error("Failed to load data", e);
        setSettings(DEMO_SETTINGS);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const heroImages = settings?.hero_image_urls && settings.hero_image_urls.length > 0
    ? settings.hero_image_urls
    : settings?.hero_image_url ? [settings.hero_image_url] : [];

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  if (isLoading || !settings) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Navbar farmName={settings.farm_name} logoUrl={settings.logo_url} />

      {/* ─── HERO ─────────────────────────────────────── */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {heroImages.map((url, index) => (
          <div
            key={url + index}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${url})`,
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
              filter: "brightness(0.5)",
              opacity: index === currentHeroIndex ? 1 : 0,
              transition: "opacity 1.8s ease-in-out",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(29,20,10,0.92) 0%, rgba(29,20,10,0.4) 50%, rgba(29,20,10,0.1) 100%)",
          }}
        />
        <div className="noise-overlay" />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "100px 20px 64px",
            width: "100%",
          }}
        >
          <motion.div variants={itemVariants}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,179,0,0.12)",
                border: "1px solid rgba(255,179,0,0.3)",
                borderRadius: "50px",
                padding: "6px 16px",
                marginBottom: "24px",
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--mango-400)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                <MapPin size={12} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> {settings.farm_location}
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            style={{
              fontFamily: "var(--font-heading), serif",
              fontSize: "clamp(38px, 9vw, 78px)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.08,
              marginBottom: "20px",
              maxWidth: "740px",
            }}
          >
            Pakistan&apos;s Finest<br />
            <span style={{ color: "var(--mango-400)", fontStyle: "italic" }}>Farm-Fresh</span> Mangoes
          </motion.h1>
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: "clamp(15px, 2.5vw, 18px)",
              color: "rgba(255,255,255,0.82)",
              maxWidth: "520px",
              lineHeight: 1.65,
              marginBottom: "36px",
            }}
          >
            {settings.farm_tagline} Hand-picked at peak ripeness, packed in 10kg wooden boxes and delivered across Pakistan via Leopard Courier.
          </motion.p>

          <motion.div variants={itemVariants} style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <a href="#varieties" className="btn-primary" id="hero-shop-btn">
              <ShoppingBag size={18} /> Browse Varieties
            </a>
            <a
              href={`https://wa.me/${settings.whatsapp_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              id="hero-whatsapp-btn"
            >
              <WhatsAppIcon size={18} />
              Chat with Us
            </a>
          </motion.div>

          <motion.div variants={itemVariants} style={{ display: "flex", gap: "24px", marginTop: "56px", flexWrap: "wrap" }}>
            {[
              { icon: <Truck size={18} />, label: "Leopard Courier" },
              { icon: <Package size={18} />, label: "10kg Wooden Box" },
              { icon: <Leaf size={18} />, label: "Farm Direct" },
              { icon: <Star size={18} />, label: "Premium Quality" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ display: "flex", alignItems: "center", color: "var(--mango-400)" }}>{item.icon}</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── DELIVERY BANNER ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        style={{
          background: "var(--leaf-900)",
          color: "white",
          padding: "14px 20px",
          textAlign: "center",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "0.01em",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
          <Truck size={16} color="var(--mango-400)" />
          <span>Leopard Courier delivery — only <strong style={{ color: "var(--mango-400)" }}>Rs {settings.delivery_charge}</strong> per 10kg box &nbsp;|&nbsp; Delivering across Pakistan</span>
        </div>
      </motion.div>

      {/* ─── PRODUCTS ─────────────────────────────────── */}
      <section id="varieties" className="section-py" style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 20px" }}>
        <AnimateOnScroll>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--leaf-700)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <Leaf size={12} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> Our Varieties
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading), serif",
                fontSize: "clamp(28px, 6vw, 44px)",
                fontWeight: 700,
                color: "var(--bark-900)",
                marginTop: "10px",
                marginBottom: "12px",
              }}
            >
              Choose Your Mango
            </h2>
            <p style={{ fontSize: "16px", color: "var(--bark-400)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
              Every box is hand-packed at our farm with the freshest mangoes of the season.
            </p>
          </div>
        </AnimateOnScroll>

        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "60px 20px", color: "var(--bark-400)" }}
          >
            <motion.span
              style={{ fontSize: "64px", display: "block", marginBottom: "16px" }}
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              🥭
            </motion.span>
            <div className="skeleton" style={{ width: "200px", height: "20px", margin: "0 auto 12px" }} />
            <div className="skeleton" style={{ width: "280px", height: "14px", margin: "0 auto" }} />
          </motion.div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "28px",
            }}
          >
            {products.map((product, i) => (
              <AnimateOnScroll key={product.id} delay={i * 80}>
                <ProductCard product={product} settings={settings} priority={i < 3} />
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </section>

      <HowItWorks />

      {/* ─── ABOUT ────────────────────────────────────── */}
      <section id="about" style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 20px" }}>
        <hr className="divider-mango" style={{ marginBottom: "64px" }} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "48px",
            alignItems: "center",
          }}
        >
          <AnimateOnScroll>
            <div
              style={{
                position: "relative",
                borderRadius: "28px",
                overflow: "hidden",
                boxShadow: "0 12px 48px var(--shadow-warm-md)",
                aspectRatio: "4/3",
                background: "var(--cream-dark)",
              }}
            >
              {settings.about_image_url && (
                <ImageWithFallback
                  src={settings.about_image_url}
                  alt="Our mango farm"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={120}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--leaf-700)", letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Leaf size={12} /> {settings.about_subtitle || "Our Story"}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading), serif",
                fontSize: "clamp(26px, 5vw, 38px)",
                fontWeight: 700,
                color: "var(--bark-900)",
                margin: "10px 0 16px",
                lineHeight: 1.2,
                whiteSpace: "pre-line",
              }}
            >
              {settings.about_title}
            </h2>
            <p style={{ fontSize: "15px", color: "var(--bark-700)", lineHeight: 1.75, marginBottom: "28px", whiteSpace: "pre-line" }}>
              {settings.about_text}
            </p>

            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
              {[
                { value: settings.years_farming, label: "Years Farming" },
                { value: `${products.length}+`, label: "Mango Varieties" },
                { value: `Rs ${settings.delivery_charge}`, label: "Delivery / Box" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <p style={{ fontSize: "26px", fontWeight: 800, color: "var(--mango-700)", lineHeight: 1 }}>{stat.value}</p>
                  <p style={{ fontSize: "12px", color: "var(--bark-400)", fontWeight: 600, marginTop: "4px" }}>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>

        {settings.custom_sections?.map((section, idx) => (
          <div
            key={section.id}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "48px",
              alignItems: "center",
              marginTop: "64px",
            }}
          >
            {section.image_position === "left" && (
              <AnimateOnScroll>
                <div
                  style={{
                    position: "relative",
                    borderRadius: "28px",
                    overflow: "hidden",
                    boxShadow: "0 12px 48px var(--shadow-warm-md)",
                    aspectRatio: "4/3",
                    background: "var(--cream-dark)",
                  }}
                >
                  {section.image_url && (
                    <ImageWithFallback
                      src={section.image_url}
                      alt={section.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                </div>
              </AnimateOnScroll>
            )}

            <AnimateOnScroll delay={120}>
              {section.subtitle && (
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--leaf-700)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {section.subtitle}
                </span>
              )}
              <h2
                style={{
                  fontFamily: "var(--font-heading), serif",
                  fontSize: "clamp(26px, 5vw, 38px)",
                  fontWeight: 700,
                  color: "var(--bark-900)",
                  margin: "10px 0 16px",
                  lineHeight: 1.2,
                  whiteSpace: "pre-line",
                }}
              >
                {section.title}
              </h2>
              <p style={{ fontSize: "15px", color: "var(--bark-700)", lineHeight: 1.75, whiteSpace: "pre-line" }}>
                {section.text}
              </p>
            </AnimateOnScroll>

            {section.image_position === "right" && (
              <AnimateOnScroll>
                <div
                  style={{
                    position: "relative",
                    borderRadius: "28px",
                    overflow: "hidden",
                    boxShadow: "0 12px 48px var(--shadow-warm-md)",
                    aspectRatio: "4/3",
                    background: "var(--cream-dark)",
                  }}
                >
                  {section.image_url && (
                    <ImageWithFallback
                      src={section.image_url}
                      alt={section.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                </div>
              </AnimateOnScroll>
            )}
          </div>
        ))}
      </section>

      {/* ─── TRUST BADGES ────────────────────────────── */}
      <section style={{ background: "var(--leaf-900)", padding: "48px 20px", position: "relative", overflow: "hidden" }}>
        <div className="mango-pattern" style={{ position: "absolute", inset: 0, opacity: 0.03 }} />
        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "24px" }}>
          {[
            { icon: <ShieldCheck size={32} color="var(--mango-400)" />, title: "Quality Guaranteed", desc: "Every mango is hand-inspected before packing." },
            { icon: <Star size={32} color="var(--mango-400)" />, title: "Premium Varieties", desc: "Sindhri, Chaunsa, Anwar Ratol & more." },
            { icon: <Truck size={32} color="var(--mango-400)" />, title: "Pakistan-Wide Delivery", desc: `Leopard Courier — Rs ${settings.delivery_charge} per box.` },
            { icon: <Package size={32} color="var(--mango-400)" />, title: "Wooden Box Packed", desc: "Safe, sturdy 10kg wooden boxes." },
          ].map((badge) => (
            <AnimateOnScroll key={badge.title}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                style={{ textAlign: "center", color: "white" }}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>{badge.icon}</div>
                <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>{badge.title}</h4>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>{badge.desc}</p>
              </motion.div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* ─── CONTACT CTA ─────────────────────────────── */}
      <section id="contact" style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <AnimateOnScroll>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--leaf-700)", letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <Phone size={12} /> Get in Touch
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading), serif",
              fontSize: "clamp(26px, 5vw, 40px)",
              fontWeight: 700,
              color: "var(--bark-900)",
              margin: "10px 0 16px",
            }}
          >
            Have Questions? Chat with Us!
          </h2>
          <p style={{ fontSize: "15px", color: "var(--bark-400)", lineHeight: 1.65, marginBottom: "36px" }}>
            The fastest way to reach us is via WhatsApp. We reply within minutes during business hours.
          </p>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={`https://wa.me/${settings.whatsapp_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            id="contact-whatsapp-btn"
            style={{ display: "inline-flex" }}
          >
            <WhatsAppIcon size={20} />
            Open WhatsApp Chat
          </motion.a>
        </AnimateOnScroll>
      </section>

      <Footer settings={settings} />
    </motion.div>
  );
}
