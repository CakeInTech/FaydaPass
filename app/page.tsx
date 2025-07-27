"use client";

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
      {/* Hero Section */}

      {/* Features Section */}
      {/* Documentation */}
      {/* Footer */}
    </div>
  );
}

export default HomePage;