"use client";

import DeveloperResources from "@/components/DeveloperResource";
import Footer from "@/components/Footer";
import Home from "@/components/Home";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <Home isVisible={isVisible} />
      {/* Hero Section */}

      {/* Features Section */}
      <DeveloperResources />
      {/* Documentation */}
      {/* Footer */}
      <Footer/>
    </div>
  );
}

export default HomePage;
