"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string | null;
  title: string;
  price: number;
  image: string;
  quantity: number;
  variantTitle?: string;
  sku: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  itemCount: number;
  subtotal: number;
  couponCode: string | null;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  shippingTotal: number;
  taxTotal: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [fixedDiscount, setFixedDiscount] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aura_cart_v1");
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem("aura_coupon_v1");
      if (savedCoupon) {
        const parsed = JSON.parse(savedCoupon);
        setCouponCode(parsed.code);
        setDiscountPercent(parsed.percent || 0);
        setFixedDiscount(parsed.fixed || 0);
      }
    } catch {
      // Ignore local storage error
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("aura_cart_v1", JSON.stringify(items));
    } catch {
      // Ignore local storage error
    }
  }, [items, mounted]);

  const addItem = (newItem: Omit<CartItem, "id">) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === newItem.productId && i.variantId === newItem.variantId
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      }

      return [
        ...prev,
        {
          ...newItem,
          id: `${newItem.productId}-${newItem.variantId || "default"}-${Date.now()}`,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string, variantId?: string | null) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && (variantId ? i.variantId === variantId : true))
      )
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    variantId?: string | null
  ) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }

    setItems((prev) =>
      prev.map((i) => {
        if (i.productId === productId && i.variantId === (variantId || undefined)) {
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setDiscountPercent(0);
    setFixedDiscount(0);
    localStorage.removeItem("aura_cart_v1");
    localStorage.removeItem("aura_coupon_v1");
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Discount calculation
  let discountAmount = 0;
  if (couponCode) {
    if (discountPercent > 0) {
      discountAmount = (subtotal * discountPercent) / 100;
    } else if (fixedDiscount > 0) {
      discountAmount = Math.min(subtotal, fixedDiscount);
    }
  }

  // Shipping: free over $150, else $15
  const shippingTotal = subtotal === 0 || subtotal >= 150 ? 0 : 15.0;
  // Tax: 8.5%
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxTotal = subtotal > 0 ? Number((taxableAmount * 0.085).toFixed(2)) : 0;
  const grandTotal = Number((taxableAmount + shippingTotal + taxTotal).toFixed(2));

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "WELCOME10") {
      setCouponCode("WELCOME10");
      setDiscountPercent(10);
      setFixedDiscount(0);
      localStorage.setItem("aura_coupon_v1", JSON.stringify({ code: "WELCOME10", percent: 10 }));
      return { success: true, message: "10% Welcome discount applied!" };
    }
    if (clean === "SAVE50") {
      if (subtotal < 250) {
        return { success: false, message: "Minimum cart value of $250 required for SAVE50." };
      }
      setCouponCode("SAVE50");
      setFixedDiscount(50);
      setDiscountPercent(0);
      localStorage.setItem("aura_coupon_v1", JSON.stringify({ code: "SAVE50", fixed: 50 }));
      return { success: true, message: "$50 discount applied!" };
    }
    if (clean === "AURA2026") {
      setCouponCode("AURA2026");
      setDiscountPercent(15);
      setFixedDiscount(0);
      localStorage.setItem("aura_coupon_v1", JSON.stringify({ code: "AURA2026", percent: 15 }));
      return { success: true, message: "15% Seasonal discount applied!" };
    }
    return { success: false, message: "Invalid promotional coupon code." };
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscountPercent(0);
    setFixedDiscount(0);
    localStorage.removeItem("aura_coupon_v1");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        itemCount,
        subtotal,
        couponCode,
        discountAmount,
        applyCoupon,
        removeCoupon,
        shippingTotal,
        taxTotal,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
