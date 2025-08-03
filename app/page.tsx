"use client";

import DeveloperResources from "@/components/DeveloperResource";
import Footer from "@/components/Footer";
import Home from "@/components/Home";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Compliance from "@/components/Compliance";

function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      <BackgroundWrapper>
        <Navbar />

        {/* Hero Section */}
        <Home isVisible={isVisible} />

        {/* Features Section */}
        <Features />

        {/* Pricing Section */}
        <Pricing />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Compliance & Security Section */}
        <Compliance />

        {/* Developer Resources */}
        <DeveloperResources />

        {/* Footer */}
        <Footer />
      </BackgroundWrapper>
    </div>
  );
}

export default HomePage;
