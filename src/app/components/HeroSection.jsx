import Link from "next/link";
import "./HeroSection.css"; // keep the gradient & animation CSS

export default function HeroSection() {
  return (
    <section className="hero-gradient flex-1 flex items-center justify-center text-center px-4 sm:px-6 lg:px-20 py-16 sm:py-24 text-white">
      <div className="max-w-3xl">
        {/* Gradient headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 sm:mb-6 leading-snug sm:leading-tight lg:leading-snug bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-yellow-100 animate-text-gradient opacity-0 animate-fadeInUp">
          আমাদের প্ল্যাটফর্মে স্বাগতম
        </h1>

        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed sm:leading-relaxed lg:leading-loose opacity-0 animate-fadeInUp animation-delay-200">
          একটি বহুমুখী প্ল্যাটফর্ম যেখানে আপনি রক্তদান করতে পারবেন, স্টাডি ম্যাটেরিয়াল কিনতে ও বিক্রি করতে পারবেন এবং ইলেকট্রিক্যাল পণ্য শপ করতে পারবেন — সব এক জায়গায়।
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 opacity-0 animate-fadeInUp animation-delay-400">
          <Link
            href="/blood"
            className="bg-white text-red-600 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow hover:bg-gray-100 transition-transform transition-colors duration-200 text-sm sm:text-base md:text-lg lg:text-xl transform hover:scale-105 hover:shadow-lg"
          >
            রক্তদান করুন
          </Link>
          <Link
            href="/marketplace"
            className="bg-white text-pink-600 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow hover:bg-gray-100 transition-transform transition-colors duration-200 text-sm sm:text-base md:text-lg lg:text-xl transform hover:scale-105 hover:shadow-lg"
          >
            মার্কেটপ্লেস
          </Link>
          <Link
            href="/ecommerce"
            className="bg-white text-orange-600 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow hover:bg-gray-100 transition-transform transition-colors duration-200 text-sm sm:text-base md:text-lg lg:text-xl transform hover:scale-105 hover:shadow-lg"
          >
            ইলেকট্রিক্যাল স্টোর
          </Link>
        </div>
      </div>
    </section>
  );
}
