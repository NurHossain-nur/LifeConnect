export default function Header({ cartItemCount, onCartClick }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-4xl font-bold text-red-600 mb-2">🛍️ Marketplace</h1>
        <p className="text-gray-600">Browse products from verified sellers</p>
      </div>
      <button
        onClick={onCartClick}
        className="relative bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        🛒 Cart ({cartItemCount})
      </button>
    </div>
  );
}
