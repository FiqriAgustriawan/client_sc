"use client";

// Original components
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { LaciTanya } from "@/components/LaciTanya";
import ReadytoChallenge from "@/components/ReadytoChallenge";
import TripExplorer from "../components/ExploreTrip";
import TripSheets from "@/components/TripSheets";

export default function Home() {
  return (
    <>
      {/* HeroSection component */}
      <HeroSection />

      <TripSheets />

      {/* FAQ section */}
      <LaciTanya />

      {/* Call to action */}
      <ReadytoChallenge />

      {/* Footer */}
      <Footer />
    </>
  );
}
