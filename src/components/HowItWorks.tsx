"use client";
import { Truck, Package as PackageIcon } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import AnimateOnScroll from "./AnimateOnScroll";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: <PackageIcon size={28} color="var(--mango-700)" />,
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
  ];

  return (
    <section id="how-it-works" style={{ background: "var(--cream-dark)", padding: "60px 20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <AnimateOnScroll>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--leaf-700)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Simple Process
            </span>
            <h2 style={{
              fontFamily: "var(--font-heading), serif",
              fontSize: "clamp(26px, 5vw, 40px)",
              fontWeight: 700,
              color: "var(--bark-900)",
              marginTop: "10px",
            }}>
              How to Order in 3 Steps
            </h2>
          </div>
        </AnimateOnScroll>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
          {steps.map((item, i) => (
            <AnimateOnScroll key={item.step} delay={i * 100}>
              <div style={{
                background: "var(--white)", borderRadius: "24px", padding: "28px 24px",
                boxShadow: "0 4px 20px var(--shadow-warm)",
                border: "1px solid rgba(255,179,0,0.08)",
                position: "relative", overflow: "hidden",
              }}>
                <div className="mango-pattern" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
                <span style={{
                  position: "absolute", top: "16px", right: "20px",
                  fontSize: "48px", fontWeight: 900,
                  color: "var(--mango-100)", lineHeight: 1,
                  fontFamily: "var(--font-heading), serif",
                }}>
                  {item.step}
                </span>
                <div style={{
                  width: "52px", height: "52px", background: "var(--mango-50)",
                  borderRadius: "16px", display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: "16px", position: "relative", zIndex: 1,
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--bark-900)", marginBottom: "8px", position: "relative", zIndex: 1 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--bark-400)", lineHeight: 1.6, position: "relative", zIndex: 1 }}>
                  {item.desc}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
