"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev[product._id];
      const newQty = existing ? existing.quantity + quantity : quantity;

      if (newQty > product.stock) {
        alert(`Only ${product.stock} units available`);
        return prev;
      }

      return { ...prev, [product._id]: { product, quantity: newQty } };
    });

    setCartOpen(true);
  };

  const updateQuantity = (id, qty) => {
    setCart((prev) => {
      const item = prev[id];
      if (!item) return prev;
      if (qty < 1 || qty > item.product.stock) return prev;
      return { ...prev, [id]: { ...item, quantity: qty } };
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const c = { ...prev };
      delete c[id];
      return c;
    });
  };

  const value = {
    cart,
    cartOpen,
    setCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
