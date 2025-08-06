"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignOutButtonProps {
  variant?: "outline" | "ghost" | "default";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showText?: boolean;
}

export default function SignOutButton({
  variant = "outline",
  size = "default",
  className = "",
  showText = true,
}: SignOutButtonProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    } catch (error) {
      console.error("Sign out error:", error);
      // Fallback redirect
      router.push("/login");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSignOut}
      disabled={isSigningOut}
      className={`text-red-400 border-red-500/30 hover:bg-red-500/10 bg-transparent ${className}`}
    >
      <LogOut className="w-4 h-4 mr-2" />
      {showText && (isSigningOut ? "Signing out..." : "Sign Out")}
    </Button>
  );
}
