"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ImageWithFallback from "@/components/ImageWithFallback";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { DEMO_SETTINGS, DEMO_PRODUCTS, Product, SiteSettings } from "@/lib/types";
import { getProducts, getSettings } from "@/lib/store";
import { Truck, Package, ShieldCheck, Star, Loader2, Leaf, MapPin, ShoppingBag } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import FacebookIcon from "@/components/FacebookIcon";
import InstagramIcon from "@/components/InstagramIcon";

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

  if (isLoading || !settings) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#1d140a", color: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🥭</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const heroImages = settings.hero_image_urls && settings.hero_image_urls.length > 0 
    ? settings.hero_image_urls 
    : [settings.hero_image_url];

  // Auto-slide effect
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <>
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
              filter: "brightness(0.55)",
              opacity: index === currentHeroIndex ? 1 : 0,
              transition: "opacity 1.5s ease-in-out",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(29,20,10,0.9) 0%, rgba(29,20,10,0.35) 55%, transparent 100%)",
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
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,179,0,0.15)",
              border: "1px solid rgba(255,179,0,0.4)",
              borderRadius: "50px",
              padding: "6px 16px",
              marginBottom: "24px",
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--mango-400)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              <MapPin size={12} style={{ display: "inline-block", verticalAlign: "middle" }} /> {settings.farm_location}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "clamp(36px, 9vw, 72px)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.1,
              marginBottom: "20px",
              maxWidth: "720px",
            }}
            className="text-balance"
          >
            Pakistan&apos;s Finest<br />
            <span style={{ color: "var(--mango-400)", fontStyle: "italic" }}>Farm-Fresh</span> Mangoes
          </h1>
          <p
            style={{
              fontSize: "clamp(15px, 2.5vw, 18px)",
              color: "rgba(255,255,255,0.82)",
              maxWidth: "520px",
              lineHeight: 1.65,
              marginBottom: "36px",
            }}
          >
            {settings.farm_tagline} Hand-picked at peak ripeness, packed in 10kg wooden boxes and delivered across Pakistan via Leopard Courier.
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
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
          </div>

          <div style={{ display: "flex", gap: "24px", marginTop: "56px", flexWrap: "wrap" }}>
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
          </div>
        </div>
      </section>

      {/* ─── DELIVERY BANNER ──────────────────────────── */}
      <div
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <Truck size={16} color="var(--mango-400)" />
          <span>Leopard Courier delivery — only <strong style={{ color: "var(--mango-400)" }}>Rs {settings.delivery_charge}</strong> per 10kg box &nbsp;|&nbsp; Delivering across Pakistan</span>
        </div>
      </div>

      {/* ─── PRODUCTS ─────────────────────────────────── */}
      <section id="varieties" className="section-py" style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 20px" }}>
        <AnimateOnScroll>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--leaf-700)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <Leaf size={12} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> Our Varieties
            </span>
            <h2
              style={{
                fontFamily: "'Lora', serif",
                fontSize: "clamp(28px, 6vw, 44px)",
                fontWeight: 700,
                color: "var(--bark-900)",
                marginTop: "8px",
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
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--bark-400)" }}>
            <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>🥭</span>
            <p style={{ fontSize: "16px" }}>Products are being loaded...</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {products.map((product, i) => (
              <AnimateOnScroll key={product.id} delay={i * 80}>
                <ProductCard product={product} settings={settings} />
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────── */}
      <section
        id="how-it-works"
        style={{ background: "var(--cream-dark)", padding: "80px 20px" }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <AnimateOnScroll>
            <div style={{ textAlign: "center", marginBottom: "52px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--leaf-700)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Simple Process
              </span>
              <h2
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: "clamp(26px, 5vw, 40px)",
                  fontWeight: 700,
                  color: "var(--bark-900)",
                  marginTop: "8px",
                }}
              >
                How to Order in 3 Steps
              </h2>
            </div>
          </AnimateOnScroll>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
            {[
              {
                step: "01",
                icon: <Package size={28} color="var(--mango-700)" />,
                title: "Pick Your Variety",
                desc: "Browse our mango varieties above. Each listing shows the season, taste notes, and price per 10kg wooden box.",
              },
              {
                step: "02",
                icon: <WhatsAppIcon size={28} color="var(--mango-700)" />,
                title: "Order on WhatsApp",
                desc: "Click 'Order Now', choose your quantity, and you'll be redirected to WhatsApp with your order pre-filled.",
              },
              {
                step: "03",
                icon: <Truck size={28} color="var(--mango-700)" />,
                title: "We Deliver via Leopard",
                desc: "We ship your fresh mangoes nationwide via Leopard Courier. Delivery charge is just Rs 400 per box.",
              },
            ].map((item, i) => (
              <AnimateOnScroll key={item.step} delay={i * 100}>
                <div
                  style={{
                    background: "var(--white)",
                    borderRadius: "24px",
                    padding: "28px 24px",
                    boxShadow: "0 4px 20px var(--shadow-warm)",
                    border: "1px solid rgba(255,179,0,0.08)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "20px",
                      fontSize: "48px",
                      fontWeight: 900,
                      color: "var(--mango-100)",
                      lineHeight: 1,
                      fontFamily: "'Lora', serif",
                    }}
                  >
                    {item.step}
                  </span>
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      background: "var(--mango-50)",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--bark-900)", marginBottom: "8px" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--bark-400)", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ────────────────────────────────────── */}
      <section id="about" style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 20px" }}>
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
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--leaf-700)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {settings.about_subtitle}
            </span>
            <h2
              style={{
                fontFamily: "'Lora', serif",
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
                <div key={stat.label}>
                  <p style={{ fontSize: "26px", fontWeight: 800, color: "var(--mango-700)", lineHeight: 1 }}>{stat.value}</p>
                  <p style={{ fontSize: "12px", color: "var(--bark-400)", fontWeight: 600, marginTop: "4px" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>

        {/* ─── CUSTOM SECTIONS ────────────────────────── */}
        {settings.custom_sections?.map((section, idx) => (
          <div
            key={section.id}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "48px",
              alignItems: "center",
              marginTop: "100px",
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
                  fontFamily: "'Lora', serif",
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
      <section style={{ background: "var(--leaf-900)", padding: "60px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px" }}>
          {[
            { icon: <ShieldCheck size={32} color="var(--mango-400)" />, title: "Quality Guaranteed", desc: "Every mango is hand-inspected before packing." },
            { icon: <Star size={32} color="var(--mango-400)" />, title: "Premium Varieties", desc: "Sindhri, Chaunsa, Anwar Ratol & more." },
            { icon: <Truck size={32} color="var(--mango-400)" />, title: "Pakistan-Wide Delivery", desc: `Leopard Courier — Rs ${settings.delivery_charge} per box.` },
            { icon: <Package size={32} color="var(--mango-400)" />, title: "Wooden Box Packed", desc: "Safe, sturdy 10kg wooden boxes." },
          ].map((badge) => (
            <AnimateOnScroll key={badge.title}>
              <div style={{ textAlign: "center", color: "white" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>{badge.icon}</div>
                <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>{badge.title}</h4>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>{badge.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* ─── CONTACT CTA ─────────────────────────────── */}
      <section id="contact" style={{ maxWidth: "700px", margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <AnimateOnScroll>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--leaf-700)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            📞 Get in Touch
          </span>
          <h2
            style={{
              fontFamily: "'Lora', serif",
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
          <a
            href={`https://wa.me/${settings.whatsapp_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            id="contact-whatsapp-btn"
            style={{ display: "inline-flex" }}
          >
            <WhatsAppIcon size={20} />
            Open WhatsApp Chat
          </a>
        </AnimateOnScroll>
      </section>

      {/* ─── FOOTER ───────────────────────────────────── */}
      <footer
        style={{
          background: "var(--bark-900)",
          color: "rgba(255,255,255,0.7)",
          padding: "48px 20px 32px",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "40px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                {settings.logo_url ? (
                  <Image src={settings.logo_url} alt="Logo" width={24} height={24} style={{ borderRadius: "6px", objectFit: "contain" }} />
                ) : (
                  <span style={{ fontSize: "24px" }}>🥭</span>
                )}
                <span style={{ fontFamily: "'Lora', serif", fontSize: "16px", fontWeight: 600, color: "white" }}>
                  {settings.farm_name}
                </span>
              </div>
              <p style={{ fontSize: "13px", lineHeight: 1.65 }}>{settings.farm_location}</p>
            </div>

            <div>
              <h5 style={{ color: "white", fontWeight: 700, fontSize: "14px", marginBottom: "16px" }}>Quick Links</h5>
              {["#varieties", "#how-it-works", "#about", "#contact"].map((href) => (
                <a
                  key={href}
                  href={href}
                  style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.6)", textDecoration: "none", marginBottom: "8px" }}
                >
                  {href.replace("#", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </a>
              ))}
            </div>

            <div>
              <h5 style={{ color: "white", fontWeight: 700, fontSize: "14px", marginBottom: "16px" }}>Contact</h5>
              <a
                href={`https://wa.me/${settings.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "rgba(255,255,255,0.6)", textDecoration: "none", marginBottom: "10px" }}
              >
                <WhatsAppIcon size={14} /> WhatsApp Us
              </a>
              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <InstagramIcon size={20} />
                </a>
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <FacebookIcon size={20} />
                </a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ fontSize: "13px" }}>
              © {new Date().getFullYear()} {settings.farm_name}. All rights reserved.
            </p>
            <a href="/admin" style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
              Admin Panel
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
