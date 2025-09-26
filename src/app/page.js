
import FeaturesOverview from "./components/FeaturesOverview";
import HeroSection from "./components/HeroSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Overview */}
      <FeaturesOverview />

    </main>
  );
}
