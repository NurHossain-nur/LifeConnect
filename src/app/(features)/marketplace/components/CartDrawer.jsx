"use client";

import { useState } from "react";

export default function CartDrawer({
  cart,
  cartOpen,
  setCartOpen,
  updateQuantity,
  removeFromCart,
  checkoutForm,
  setCheckoutForm,
  handleCheckout,
  checkoutLoading,
}) {
  const cartItems = Object.values(cart);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product.price - (item.product.discount || 0);
    return acc + price * item.quantity;
  }, 0);

  const totalDeliveryCharge = cartItems.reduce((acc, item) => {
    return acc + (item.product.deliveryCharge || 0);
  }, 0);

  const total = subtotal + totalDeliveryCharge;

  return (
    <div
      className={`fixed text-black top-0 right-0 h-full w-96 bg-white shadow-xl transform transition-transform ${
        cartOpen ? "translate-x-0" : "translate-x-full"
      } z-50 flex flex-col`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">🛒 Your Cart</h2>
        <button
          onClick={() => setCartOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">Your cart is empty</p>
        ) : (
          cartItems.map(({ product, quantity }) => (
            <div key={product._id} className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-3">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    ${product.price - (product.discount || 0)} × {quantity} = $
                    {(product.price - (product.discount || 0)) * quantity}
                  </p>
                  {product.deliveryCharge > 0 && (
                    <p className="text-sm text-gray-500">
                      Delivery Charge: ${product.deliveryCharge}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  max={product.stock}
                  onChange={(e) => updateQuantity(product._id, Number(e.target.value))}
                  className="w-16 px-2 py-1 border rounded focus:ring-2 focus:ring-red-400"
                />
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Checkout Form */}
      {cartItems.length > 0 && (
        <div className="p-4 border-t border-gray-200 space-y-3">
          <h3 className="font-semibold text-lg">Customer Details</h3>
          <input
            type="text"
            placeholder="Full Name"
            value={checkoutForm.name}
            onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={checkoutForm.email}
            onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-400"
          />
          <input
            type="text"
            placeholder="Phone"
            value={checkoutForm.phone}
            onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-400"
          />
          <textarea
            placeholder="Delivery Address"
            value={checkoutForm.address}
            onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-400"
          />

          <div className="flex justify-between mt-2">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charges:</span>
            <span>${totalDeliveryCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className={`w-full py-2 rounded text-white ${
              checkoutLoading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
            } transition`}
          >
            {checkoutLoading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
}
