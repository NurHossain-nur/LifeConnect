export default function Header({ cartItemCount, onCartClick }) {
  return (
    <div className="flex  sm:flex-row justify-between items-center sm:items-center gap-3 sm:gap-0">
      {/* Title & Subtitle */}
      <div className="text-center sm:text-left flex flex-col gap-1">
        {/* <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-red-600">
          🛍️ Marketplace
        </h1> */}
        <p className="text-xs sm:text-sm md:text-base text-gray-600">
          Browse products from verified sellers
        </p>
      </div>

      {/* Cart Button with Badge */}
      <button
        onClick={onCartClick}
        className="relative mt-2 sm:mt-0 bg-red-500 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-md hover:bg-red-600 transition-all flex items-center justify-center text-xs sm:text-sm md:text-base"
      >
        🛒
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-yellow-400 text-red-700 rounded-full text-[10px] sm:text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-md">
            {cartItemCount}
          </span>
        )}
        <span className="ml-2 hidden sm:inline">Cart</span>
      </button>
    </div>
  );
}
