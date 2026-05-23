import type { NextConfig } from "next";

const defaultDomains = [
  "res.cloudinary.com",
  "images.unsplash.com",
  "lh3.googleusercontent.com",
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
  "www.shutterstock.com",
  "image.shutterstock.com",
  "pixabay.com",
  "cdn.pixabay.com",
  "pexels.com",
  "images.pexels.com",
  "drive.google.com",
  "lh3.googleusercontent.com",
  "docs.google.com",
  "photos.google.com",
  "i.imgur.com",
  "i.ibb.co",
  "cdn.shopify.com",
  "shopify.com",
  "*.shopify.com",
];

const allowedDomains = process.env.ALLOWED_IMAGE_DOMAINS
  ? process.env.ALLOWED_IMAGE_DOMAINS.split(",").map((d) => d.trim())
  : defaultDomains;

const nextConfig: NextConfig = {
  async headers() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    if (!siteUrl) return [];

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: allowedDomains.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
