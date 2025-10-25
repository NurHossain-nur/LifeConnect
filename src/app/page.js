
import UserInfo from "@/components/UserInfo";
import FeaturesOverview from "./components/FeaturesOverview";
import HeroSection from "./components/HeroSection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";


export default async function HomePage() {

  const session = await getServerSession(authOptions);
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">


      {/* Hero Section */}
      <HeroSection />

      <UserInfo></UserInfo>
      <p>{JSON.stringify(session)}</p>

      {/* Features Overview */}
      <FeaturesOverview />

    </main>
  );
}
