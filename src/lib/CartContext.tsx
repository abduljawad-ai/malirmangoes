"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  getQty: (productId: string) => number;
  totalItems: number;
  clearCart: () => void;
}

// ─── Context ──────────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "malir_mangoes_cart";

// ─── Provider ─────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  // `mounted` stays false until after the first client render where
  // localStorage has been read. This prevents a hydration mismatch
  // (server renders empty cart → client flashes to "items in cart" state).
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount — runs only on the client
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCart(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
    setMounted(true);
  }, []);

  // Persist to localStorage on every change (skip the initial empty state)
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, mounted]);

  const addToCart = useCallback((productId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty < 1) {
      setCart((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setCart((prev) =>
        prev.map((i) =>
          i.productId === productId ? { ...i, quantity: qty } : i
        )
      );
    }
  }, []);

  const getQty = useCallback(
    (productId: string) => cart.find((i) => i.productId === productId)?.quantity ?? 0,
    [cart]
  );

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const clearCart = useCallback(() => setCart([]), []);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, getQty, totalItems, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
