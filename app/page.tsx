"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Home from "@/components/Home";

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
      {/* Documentation */}
      {/* Footer */}
    </div>
  );
}

export default HomePage;
