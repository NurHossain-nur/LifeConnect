import Link from "next/link";

export default function FeaturesOverview() {
  return (
    <section className="py-16 px-6 bg-white">
      <h2 className="text-3xl font-bold text-center mb-12">Explore Our Features</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Blood Donation */}
        <div className="p-6 border rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3 text-red-600">Blood Donation</h3>
          <p className="text-gray-600 mb-4">
            Register as a donor or find a matching donor nearby. Save lives by donating blood easily.
          </p>
          <Link href="/blood" className="text-red-600 font-semibold hover:underline">
            Get Started →
          </Link>
        </div>

        {/* Marketplace */}
        <div className="p-6 border rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3 text-pink-600">Digital Marketplace</h3>
          <p className="text-gray-600 mb-4">
            Buy and sell study notes, PDFs, and guides securely with online payments and instant downloads.
          </p>
          <Link href="/marketplace" className="text-pink-600 font-semibold hover:underline">
            Explore →
          </Link>
        </div>

        {/* Electrical Store */}
        <div className="p-6 border rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3 text-orange-600">Electrical Supplies</h3>
          <p className="text-gray-600 mb-4">
            Shop for electrical products with easy checkout and fast delivery management.
          </p>
          <Link href="/features/ecommerce" className="text-orange-600 font-semibold hover:underline">
            Shop Now →
          </Link>
        </div>
      </div>
    </section>
  );
}
