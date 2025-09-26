import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="flex-1 flex items-center justify-center text-center px-6 py-20 bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 text-white">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-bold mb-4">Welcome to My Platform</h1>
        <p className="text-lg mb-6">
          A multi-feature platform where you can donate blood, buy & sell
          study materials, and shop electrical supplies – all in one place.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/blood"
            className="bg-white text-red-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Donate Blood
          </Link>
          <Link
            href="/marketplace"
            className="bg-white text-pink-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Marketplace
          </Link>
          <Link
            href="/ecommerce"
            className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Electrical Store
          </Link>
        </div>
      </div>
    </section>
  );
}
