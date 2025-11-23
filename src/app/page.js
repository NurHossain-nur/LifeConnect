
import UserInfo from "@/components/UserInfo";
import FeaturesOverview from "./components/FeaturesOverview";
import HeroSection from "./components/HeroSection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import FeaturedProducts from "./components/FeaturedProducts";
import FeaturedShops from "./components/FeaturedShops";


export default async function HomePage() {

  const session = await getServerSession(authOptions);
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">


      {/* Hero Section */}
      <HeroSection />

      {/* <UserInfo></UserInfo> */}
      {/* <p>{JSON.stringify(session)}</p> */}

      {/* Featured Shops */}
      <FeaturedShops />

      {/* Featured Marketplace Items (New) */}
      <FeaturedProducts />

      {/* Features Overview */}
      <FeaturesOverview />

    </main>
  );
}
