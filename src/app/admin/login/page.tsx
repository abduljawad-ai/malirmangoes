"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Incorrect password. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--cream)",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "var(--white)",
          borderRadius: "28px",
          padding: "40px 32px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 12px 48px var(--shadow-warm-md)",
          border: "1px solid rgba(255,179,0,0.12)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span style={{ fontSize: "48px" }}>🥭</span>
          <h1
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--bark-900)",
              marginTop: "12px",
              marginBottom: "6px",
            }}
          >
            Admin Panel
          </h1>
          <p style={{ fontSize: "14px", color: "var(--bark-400)" }}>
            Mango Farm Pakistan
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--bark-700)", marginBottom: "8px" }}
          >
            <Lock size={13} style={{ display: "inline", marginRight: "4px" }} />
            Password
          </label>
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <input
              id="admin-password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              style={{
                width: "100%",
                padding: "14px 48px 14px 16px",
                borderRadius: "14px",
                border: error ? "2px solid #E53E3E" : "2px solid var(--cream-dark)",
                fontSize: "15px",
                color: "var(--bark-900)",
                background: "var(--cream)",
                outline: "none",
                transition: "border 0.2s",
              }}
              onFocus={(e) => !error && ((e.target as HTMLElement).style.border = "2px solid var(--mango-500)")}
              onBlur={(e) => !error && ((e.target as HTMLElement).style.border = "2px solid var(--cream-dark)")}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--bark-400)" }}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p style={{ fontSize: "13px", color: "#E53E3E", marginBottom: "16px", fontWeight: 500 }}>
              ⚠ {error}
            </p>
          )}

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ fontSize: "12px", color: "var(--bark-400)", textAlign: "center", marginTop: "24px" }}>
          <Link href="/" style={{ color: "var(--leaf-700)", textDecoration: "none", fontWeight: 600 }}>
            ← Back to Store
          </Link>
        </p>
      </div>
    </div>
  );
}
