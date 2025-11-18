"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Load cart
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add to cart
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

  // Remove item
  const removeFromCart = (id) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[id];
      return newCart;
    });
  };

  // Update qty
  const updateQuantity = (id, qty) => {
    setCart((prev) => {
      const item = prev[id];
      if (!item) return prev;
      if (qty < 1 || qty > item.product.stock) return prev;

      return { ...prev, [id]: { ...item, quantity: qty } };
    });
  };

  // Checkout
  const handleCheckout = async () => {
    const cartItems = Object.values(cart);

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const { name, email, phone, address } = checkoutForm;
    if (!name || !email || !phone || !address) {
      alert("Please fill in all your details.");
      return;
    }

    try {
      setCheckoutLoading(true);

      const orderPayload = {
        customer: checkoutForm,
        items: cartItems.map(({ product, quantity }) => ({
          productId: product._id,
          sellerId: product.sellerId,
          quantity,
          price: product.price - (product.discount || 0),
          deliveryCharge: product.deliveryCharge || 0,
        })),
        createdAt: new Date(),
      };

      const res = await fetch("/api/marketplace/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Checkout failed.");
        return;
      }

      // Save order
      const savedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
      savedOrders.push({
        orderId: data.orderId,
        customer: checkoutForm,
        items: orderPayload.items,
        createdAt: new Date().toISOString(),
        status: "pending",
      });

      localStorage.setItem("myOrders", JSON.stringify(savedOrders));

      alert("Order placed successfully!");

      setCart({});
      setCartOpen(false);
      setCheckoutForm({ name: "", email: "", phone: "", address: "" });
    } catch (err) {
      console.error(err);
      alert("Error placing order.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        checkoutForm,
        setCheckoutForm,
        handleCheckout,
        checkoutLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
