"use client";

import DeveloperResources from "@/components/DeveloperResource";
import Footer from "@/components/Footer";
import Home from "@/components/Home";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import Features from "@/components/Features";

function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      <BackgroundWrapper>
        <Navbar />

        <Home isVisible={isVisible} />
        {/* Hero Section */}

        {/* Features Section */}
        <Features />
        <DeveloperResources />
        {/* Documentation */}
        {/* Footer */}
        <Footer />
      </BackgroundWrapper>
    </div>
  );
}

export default HomePage;
