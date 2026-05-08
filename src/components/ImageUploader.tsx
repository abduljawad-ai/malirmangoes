import { useState, useRef } from "react";
import { UploadCloud, Loader2, Link as LinkIcon } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUploader({ value, onChange, label, placeholder }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    console.log("Checking Cloudinary Envs - Cloud:", cloudName ? "Exists" : "Missing", "Preset:", uploadPreset ? "Exists" : "Missing");

    if (!cloudName || !uploadPreset) {
      setError("Cloudinary configuration missing in .env.local");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      onChange(data.secure_url);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again or paste a URL.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      {label && (
        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--bark-700)", marginBottom: "8px" }}>
          {label}
        </label>
      )}
      <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ position: "absolute", left: "12px", top: "14px", color: "var(--bark-400)" }}>
            <LinkIcon size={16} />
          </div>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Paste image URL or upload ->"}
            style={{
              width: "100%",
              padding: "12px 16px 12px 38px",
              borderRadius: "12px",
              border: "1px solid rgba(255,179,0,0.2)",
              fontSize: "14px",
              background: "var(--white)",
              outline: "none",
            }}
            onFocus={(e) => ((e.target as HTMLElement).style.border = "1px solid var(--mango-500)")}
            onBlur={(e) => ((e.target as HTMLElement).style.border = "1px solid rgba(255,179,0,0.2)")}
          />
        </div>
        
        <div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleUpload}
            style={{ display: "none" }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "12px 16px",
              background: "var(--mango-50)",
              color: "var(--mango-700)",
              border: "1px solid var(--mango-300)",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: uploading ? "not-allowed" : "pointer",
              opacity: uploading ? 0.7 : 1,
              whiteSpace: "nowrap",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => !uploading && ((e.target as HTMLElement).style.background = "var(--mango-100)")}
            onMouseLeave={(e) => !uploading && ((e.target as HTMLElement).style.background = "var(--mango-50)")}
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </div>
      {error && (
        <p style={{ fontSize: "12px", color: "#E53E3E", marginTop: "6px", fontWeight: 500 }}>
          {error}
        </p>
      )}
    </div>
  );
}
