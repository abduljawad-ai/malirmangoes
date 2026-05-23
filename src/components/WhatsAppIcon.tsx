import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppIcon({ size = 20, color = "currentColor" }: { size?: number, color?: string }) {
  return <FaWhatsapp size={size} color={color} />;
}