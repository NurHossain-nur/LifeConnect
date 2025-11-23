"use client";

import { useEffect, useState } from "react";
import { Store } from "lucide-react";

export default function FeaturedShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch("/api/marketplace/shops");
        const data = await res.json();
        if (data.success) {
          setShops(data.shops);
        }
      } catch (error) {
        console.error("Failed to load shops", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  if (loading)
    return (
      <div className="h-32 bg-gray-50 animate-pulse mx-auto max-w-7xl mt-10 rounded-xl"></div>
    );
  if (shops.length === 0) return null;

  return (
    <section className="py-10 bg-gray-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Store className="text-red-600" /> Top Shops
        </h2>
      </div>

      {/* The 'group' class here detects hover on the WHOLE area.
         The animation inside responds to this group hover.
      */}
      <div className="relative w-full overflow-hidden group bg-white py-4 shadow-sm">
        
        {/* logic: animate-scroll runs normally.
           group-hover:[animation-play-state:paused] -> Stops it when you hover.
           When you remove the mouse, it automatically removes 'paused' and starts again.
        */}
        <div className="flex w-max animate-scroll group-hover:[animation-play-state:paused]">
          
          {/* Render list twice for infinite loop */}
          {[...shops, ...shops].map((shop, index) => (
            <ShopItem key={`${shop._id}-${index}`} shop={shop} />
          ))}
          
        </div>

        {/* Gradient Fade Effects */}
        <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        /* Extra safety: Ensure it pauses on hover even if Tailwind JIT misses it */
        .group:hover .animate-scroll {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

// Single Shop Component
function ShopItem({ shop }) {
  return (
    <a
      href={`/marketplace/shop/${shop.userId}`}
      className="flex flex-col items-center justify-center mx-6 w-28 group/item cursor-pointer"
    >
      {/* Image Container */}
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 border-2 border-red-100 bg-white shadow-sm overflow-hidden transition-all duration-300 group-hover/item:border-red-500 group-hover/item:scale-105">
        <img
          src={shop.profileImage || "/default-avatar.png"}
          alt={shop.shopName}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      
      {/* Text Container */}
      <div className="mt-3 w-full text-center px-1">
        <h3 className="text-sm font-medium text-gray-700 truncate w-full block group-hover/item:text-red-600 transition-colors">
          {shop.shopName}
        </h3>
      </div>
    </a>
  );
}