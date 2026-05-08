"use client";
import Image, { ImageProps } from "next/image";

export default function ImageWithFallback(props: ImageProps) {
  return (
    <Image
      {...props}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  );
}
