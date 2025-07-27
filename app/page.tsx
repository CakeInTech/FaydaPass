"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Home from "@/components/Home";
import Footer from "@/components/Footer";
import BackgroundWrapper from "@/components/BackgroundWrapper";
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
        {/* Documentation */}
        {/* Footer */}
        <Footer />
      </BackgroundWrapper>
    </div>
  );
}

export default HomePage;
