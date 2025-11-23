"use client";

import { useCart } from "../CartContext";
import { useEffect } from "react";

// Icons
const Icons = {
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Minus: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>,
  Plus: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  ShoppingBag: () => <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
};

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


  // Prevent background scroll when cart is open
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [cartOpen]);

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
      {/* Backdrop with fade transition */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          cartOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out
          w-full h-[90vh] bottom-0 rounded-t-2xl left-0
          md:top-0 md:right-0 md:h-full md:w-[450px] md:left-auto md:bottom-auto md:rounded-none
          ${cartOpen 
            ? "translate-y-0 md:translate-x-0" 
            : "translate-y-full md:translate-x-full"
          }
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white rounded-t-2xl md:rounded-none">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">আপনার ঝুড়ি</h2>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {cartItems.length} items
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <Icons.Close />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
          {/* Cart Items List */}
          <div className="space-y-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Icons.ShoppingBag />
                <p className="text-gray-500 font-medium">আপনার ঝুড়ি খালি</p>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="mt-4 text-sm text-green-600 font-bold hover:underline"
                >
                  কেনাকাটা শুরু করুন
                </button>
              </div>
            ) : (
              cartItems.map(({ product, quantity }) => {
                const price = product.price - (product.discount || 0);
                return (
                  <div
                    key={product._id}
                    className="flex gap-4 group relative"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={product.images?.[0] || "/no-image.png"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                        <div className="mt-1 text-xs text-gray-500 flex gap-2">
                           <span>৳{price} x {quantity}</span>
                           {product.deliveryCharge > 0 && (
                             <span className="text-orange-500">+ ৳{product.deliveryCharge} del</span>
                           )}
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center border border-gray-300 rounded-lg h-8">
                          <button
                            onClick={() => updateQuantity(product._id, Math.max(1, quantity - 1))}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-l-lg transition"
                          >
                            <Icons.Minus />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-gray-800">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product._id, Math.min(product.stock || 100, quantity + 1))}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-r-lg transition"
                          >
                            <Icons.Plus />
                          </button>
                        </div>
                        <span className="font-bold text-gray-900">৳{price * quantity}</span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="absolute top-0 right-0 p-1 text-gray-300 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer / Checkout Form */}
        {cartItems.length > 0 && (
          <div className="bg-gray-50 p-5 border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            
            {/* Summary */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>মোট পণ্য মূল্য:</span>
                <span className="font-medium text-gray-900">৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-medium text-gray-900">৳{totalDeliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                <span>সর্বমোট:</span>
                <span className="text-green-700">৳{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Compact Form */}
            <div className="space-y-3 text-black">
               <h3 className="text-xs  font-bold text-gray-500 uppercase tracking-wider">Shipping Info</h3>
               
               <div className="grid grid-cols-2 gap-3 text-black">
                 <input
                   type="text"
                   placeholder="আপনার নাম"
                   value={checkoutForm.name}
                   onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                   className="input-field"
                 />
                 <input
                   type="text"
                   placeholder="ফোন নম্বর"
                   value={checkoutForm.phone}
                   onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                   className="input-field"
                 />
               </div>
               <input
                 type="email"
                 placeholder="ইমেইল (ঐচ্ছিক)"
                 value={checkoutForm.email}
                 onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                 className="input-field"
               />
               <textarea
                 placeholder="সম্পূর্ণ ঠিকানা (এলাকা, জেলা)"
                 value={checkoutForm.address}
                 onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                 rows={2}
                 className="input-field resize-none"
               />

               <button
                 onClick={handleCheckout}
                 disabled={checkoutLoading}
                 className={`w-full py-3.5 rounded-xl text-white font-bold shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2
                   ${checkoutLoading 
                     ? "bg-gray-400 cursor-not-allowed" 
                     : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-green-200"
                   }`}
               >
                 {checkoutLoading ? (
                   <>
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     প্রসেসিং...
                   </>
                 ) : "অর্ডার নিশ্চিত করুন"}
               </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.65rem 0.85rem;
          font-size: 0.85rem;
          outline: none;
          transition: all 0.2s;
        }
        .input-field:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </>
  );
}