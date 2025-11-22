"use client";

import { useCart } from "../CartContext";

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    checkoutForm,
    setCheckoutForm,
    handleCheckout,
    checkoutLoading,
  } = useCart();

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
    <>
      {/* Backdrop for mobile */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          className="fixed inset-0 bg-black opacity-70 z-40 sm:hidden"
        />
      )}

      <div
        className={`text-black fixed z-50 flex flex-col bg-white shadow-xl transform transition-transform
          sm:top-0 sm:right-0 sm:h-full sm:w-96 sm:translate-x-${cartOpen ? "0" : "full"}
          bottom-0 left-0 w-full h-[75%] rounded-t-lg sm:rounded-none
          ${cartOpen ? "translate-y-0" : "translate-y-full"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-200">
          <h2 className="text-base sm:text-xl font-semibold">🛒 Your Cart</h2>
          <button
            onClick={() => setCartOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
          >
            ✖
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-6 text-xs sm:text-base">
              Your cart is empty
            </p>
          ) : (
            cartItems.map(({ product, quantity }) => (
              <div
                key={product._id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 gap-2 sm:gap-0"
              >
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 sm:w-20 sm:h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-xs sm:text-base">{product.name}</p>
                    <p className="text-[10px] sm:text-sm text-gray-500">
                      ${product.price - (product.discount || 0)} × {quantity} = $
                      {(product.price - (product.discount || 0)) * quantity}
                    </p>
                    {product.deliveryCharge > 0 && (
                      <p className="text-[10px] sm:text-sm text-gray-500">
                        Delivery: ${product.deliveryCharge}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center sm:flex-col gap-1 mt-1 sm:mt-0 w-full sm:w-auto">
                  <div className="flex border rounded overflow-hidden text-xs sm:text-sm">
                    <button
                      onClick={() =>
                        updateQuantity(
                          product._id,
                          Math.max(1, quantity - 1)
                        )
                      }
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-2 py-1 border-l border-r w-10 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          product._id,
                          Math.min(product.stock, quantity + 1)
                        )
                      }
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="text-red-500 hover:underline text-xs sm:text-sm mt-1 sm:mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Section */}
{cartItems.length > 0 && (
  <div className="p-3 sm:p-4 border-t border-gray-200 space-y-2 sm:space-y-3 text-xs sm:text-sm bg-white sticky bottom-0">
    
    {/* Section Title */}
    <h3 className="font-semibold text-sm sm:text-base mb-1">ক্রেতার তথ্য</h3>

    {/* Name */}
    <label className="block text-xs sm:text-sm mb-1 font-medium">পূর্ণ নাম</label>
    <input
      type="text"
      placeholder="আপনার পূর্ণ নাম লিখুন"
      value={checkoutForm.name}
      onChange={(e) =>
        setCheckoutForm({ ...checkoutForm, name: e.target.value })
      }
      className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-red-400 text-xs"
    />

    {/* Email */}
    <label className="block text-xs sm:text-sm mb-1 font-medium mt-2">ইমেইল</label>
    <input
      type="email"
      placeholder="আপনার ইমেইল লিখুন"
      value={checkoutForm.email}
      onChange={(e) =>
        setCheckoutForm({ ...checkoutForm, email: e.target.value })
      }
      className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-red-400 text-xs"
    />

    {/* Phone */}
    <label className="block text-xs sm:text-sm mb-1 font-medium mt-2">ফোন নম্বর</label>
    <input
      type="text"
      placeholder="আপনার ফোন নম্বর লিখুন"
      value={checkoutForm.phone}
      onChange={(e) =>
        setCheckoutForm({ ...checkoutForm, phone: e.target.value })
      }
      className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-red-400 text-xs"
    />

    {/* Address */}
    <label className="block text-xs sm:text-sm mb-1 font-medium mt-2">ডেলিভারি ঠিকানা</label>
    <textarea
      placeholder="বাড়ি/ফ্ল্যাট নাম্বার, রোড/স্ট্রিট, এলাকা, জেলা, পোস্টকোড"
      value={checkoutForm.address}
      onChange={(e) =>
        setCheckoutForm({ ...checkoutForm, address: e.target.value })
      }
      className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-red-400 text-xs"
    />

    {/* Totals */}
    <div className="flex justify-between text-xs sm:text-sm mt-2">
      <span>মোট পণ্য মূল্য:</span>
      <span>${subtotal.toFixed(2)}</span>
    </div>

    <div className="flex justify-between text-xs sm:text-sm">
      <span>ডেলিভারি চার্জ:</span>
      <span>${totalDeliveryCharge.toFixed(2)}</span>
    </div>

    <div className="flex justify-between font-bold text-sm sm:text-base">
      <span>মোট:</span>
      <span>${total.toFixed(2)}</span>
    </div>

    {/* Checkout Button */}
    <button
      onClick={handleCheckout}
      disabled={checkoutLoading}
      className={`w-full py-2 rounded text-white text-sm ${
        checkoutLoading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600"
      } transition mt-2`}
    >
      {checkoutLoading ? "অর্ডার প্রক্রিয়াধীন..." : "অর্ডার করুন"}
    </button>
  </div>
)}
      </div>
    </>
  );
}
