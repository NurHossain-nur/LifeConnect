"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

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

      // Professional Stock Alert (Toast)
      if (newQty > product.stock) {
        Swal.fire({
          icon: 'warning',
          title: 'স্টক শেষ!',
          text: `মাত্র ${product.stock} টি পণ্য স্টকে আছে`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        return prev;
      }

      // Success Toast (Optional, for better UX)
      if (!existing) {
         Swal.fire({
            icon: 'success',
            title: 'কার্টে যোগ করা হয়েছে',
            text: product.name,
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 2000
         });
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

    // Empty Cart Alert
    if (cartItems.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'আপনার ঝুড়ি খালি',
        text: 'অনুগ্রহ করে প্রথমে কিছু পণ্য যোগ করুন।',
        confirmButtonColor: '#3085d6',
      });
      return false;
    }

    const { name, email, phone, address } = checkoutForm;
    
    // Validation Alert
    if (!name || !phone || !address) {
      Swal.fire({
        icon: 'warning',
        title: 'তথ্য আবশ্যক',
        text: 'অনুগ্রহ করে আপনার নাম, ফোন নম্বর এবং ঠিকানা প্রদান করুন।',
        confirmButtonColor: '#d33',
      });
      return false;
    }

    try {
      setCheckoutLoading(true);

      const orderPayload = {
        customer: checkoutForm,
        items: cartItems.map(({ product, quantity }) => ({
          productId: product._id,
          sellerId: product.sellerId,
          quantity,
          price: product.price,
          discount: product.discount || 0,
          finalPrice: product.price - (product.discount || 0),
          deliveryCharge: product.deliveryCharge || 0,
          image: product.images?.[0] || "/no-image.png",
          name: product.name,
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
        Swal.fire({
            icon: 'error',
            title: 'দুঃখিত',
            text: data.message || "অর্ডার সম্পন্ন করা যায়নি।",
        });
        return false;
      }

      // Save order locally
      const savedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
      savedOrders.push({
        orderId: data.orderId,
        customer: checkoutForm,
        items: orderPayload.items,
        createdAt: new Date().toISOString(),
        status: "pending",
      });

      localStorage.setItem("myOrders", JSON.stringify(savedOrders));

      // Clear Cart
      setCart({});
      setCheckoutForm({ name: "", email: "", phone: "", address: "" });
      
      // Return true to let the UI Component (Drawer) handle closing and success animation
      return true;

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'সার্ভার ত্রুটি',
        text: 'দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।',
      });
      return false;
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