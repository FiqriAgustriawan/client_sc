"use client";

import { Suspense, lazy } from "react";
import dynamic from "next/dynamic";

// Import only the HeroSection directly - it's critical UI
import HeroSection from "@/components/HeroSection";

// Enhanced loading fallback with skeleton UI
const SkeletonLoader = ({ height = "h-32" }) => (
  <div className={`w-full ${height} bg-gray-100 animate-pulse rounded-lg mb-4`}>
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Enhanced loading components
const TripSheetsLoading = () => <SkeletonLoader height="h-96" />;
const BannerSlideLoading = () => <SkeletonLoader height="h-64" />;
const HighlightDestinationsLoading = () => <SkeletonLoader height="h-screen" />;
const BenefitCardsLoading = () => <SkeletonLoader height="h-80" />;
const ReadytoChallengeLoading = () => <SkeletonLoader height="h-64" />;
const FooterLoading = () => <SkeletonLoader height="h-32" />;

// Use dynamic imports with enhanced loading states
const TripSheets = dynamic(() => import("@/components/TripSheets"), {
  loading: TripSheetsLoading,
  ssr: true,
});

const BannerSlide = dynamic(() => import("@/components/BannerSlide"), {
  loading: BannerSlideLoading,
  ssr: true,
});

const HighlightDestinations = dynamic(
  () => import("@/components/HighlightDestinations"),
  {
    loading: HighlightDestinationsLoading,
    ssr: true,
  }
);

const BenefitCards = dynamic(() => import("@/components/BenefitCards"), {
  loading: BenefitCardsLoading,
  ssr: true,
});

const LaciTanya = dynamic(
  () =>
    import("@/components/LaciTanya").then((mod) => ({
      default: mod.LaciTanya,
    })),
  {
    loading: () => <SkeletonLoader height="h-96" />,
    ssr: true,
  }
);

const ReadytoChallenge = dynamic(
  () => import("@/components/ReadytoChallenge"),
  {
    loading: ReadytoChallengeLoading,
    ssr: true,
  }
);

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: FooterLoading,
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero section with improved spacing */}
      <section className="relative">
        <HeroSection />
      </section>

      {/* Content sections with improved spacing and layout */}
      <div className="relative">
        {/* Trip Sheets Section */}
        <section className="py-8 md:py-12 lg:py-16">
          <Suspense fallback={<TripSheetsLoading />}>
            <TripSheets />
          </Suspense>
        </section>

        {/* Banner Slide Section */}
        <section className="py-4 md:py-8">
          <Suspense fallback={<BannerSlideLoading />}>
            <BannerSlide />
          </Suspense>
        </section>

        {/* Highlight Destinations Section */}
        <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white">
          <Suspense fallback={<HighlightDestinationsLoading />}>
            <HighlightDestinations />
          </Suspense>
        </section>

        {/* Benefit Cards Section */}
        <section className="py-8 md:py-12 lg:py-16 bg-white">
          <Suspense fallback={<BenefitCardsLoading />}>
            <BenefitCards />
          </Suspense>
        </section>

        {/* FAQ Section - Commented out as per original */}
        {/* 
        <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
          <Suspense fallback={<SkeletonLoader height="h-96" />}>
            <LaciTanya />
          </Suspense>
        </section>
        */}

        {/* Ready to Challenge Section */}
        <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
          <Suspense fallback={<ReadytoChallengeLoading />}>
            <ReadytoChallenge />
          </Suspense>
        </section>

        {/* Footer Section */}
        <footer className="mt-auto">
          <Suspense fallback={<FooterLoading />}>
            <Footer />
          </Suspense>
        </footer>
      </div>

      {/* Scroll to top button for better UX */}
      <ScrollToTopButton />
    </main>
  );
}

// Scroll to top component for better mobile UX
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 md:bottom-8 md:right-8"
          aria-label="Scroll to top"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </>
  );
};

// Add missing imports
import { useState, useEffect } from "react";
