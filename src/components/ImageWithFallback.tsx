"use client";
import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Package } from "lucide-react";

export default function ImageWithFallback(props: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--cream-dark)",
          gap: "8px",
        }}
      >
        <Package size={28} color="var(--bark-300)" />
        <span style={{ fontSize: "11px", color: "var(--bark-400)", fontWeight: 600 }}>Image unavailable</span>
      </div>
    );
  }

  return (
    <Image
      {...props}
      onError={() => setFailed(true)}
    />
  );
}
