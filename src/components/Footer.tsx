"use client";
import { SiteSettings } from "@/lib/types";
import WhatsAppIcon from "./WhatsAppIcon";
import FacebookIcon from "./FacebookIcon";
import InstagramIcon from "./InstagramIcon";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer style={{
      background: "var(--bark-900)", color: "rgba(255,255,255,0.7)",
      padding: "48px 20px 32px",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "40px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="Logo" width={24} height={24} style={{ borderRadius: "6px", objectFit: "contain" }} />
              ) : (
                <div style={{ background: "var(--mango-600)", padding: "4px", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--bark-900)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                </div>
              )}
              <span style={{ fontFamily: "var(--font-heading), serif", fontSize: "16px", fontWeight: 600, color: "white" }}>
                {settings.farm_name}
              </span>
            </div>
            <p style={{ fontSize: "13px", lineHeight: 1.65 }}>{settings.farm_location}</p>
          </div>

          <div>
            <h5 style={{ color: "white", fontWeight: 700, fontSize: "14px", marginBottom: "16px" }}>Quick Links</h5>
            {["#varieties", "#how-it-works", "#about", "#contact"].map((href) => (
              <a key={href} href={href} style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.6)", textDecoration: "none", marginBottom: "6px" }}>
                {href.replace("#", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </a>
            ))}
          </div>

          <div>
            <h5 style={{ color: "white", fontWeight: 700, fontSize: "14px", marginBottom: "16px" }}>Contact</h5>
            <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "rgba(255,255,255,0.6)", textDecoration: "none", marginBottom: "10px" }}>
              <WhatsAppIcon size={14} /> WhatsApp Us
            </a>
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                style={{ color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", transition: "background 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.18)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)")}>
                <InstagramIcon size={22} />
              </a>
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                style={{ color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", transition: "background 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.18)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)")}>
                <FacebookIcon size={22} />
              </a>
            </div>
          </div>
        </div>

        <hr className="divider-mango" style={{ opacity: 0.15 }} />
        <div style={{ paddingTop: "24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "13px" }}>
            &copy; {new Date().getFullYear()} {settings.farm_name}. All rights reserved.
          </p>
          <a href="/admin" style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
            Admin Panel
          </a>
        </div>
      </div>
    </footer>
  );
}
