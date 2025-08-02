"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Code, Eye, EyeOff } from "lucide-react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import { createDeveloperUser } from "@/lib/supabase";
import { toast } from "sonner";

interface DeveloperFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  use_case: string;
  project: string;
}

const useCases = [
  "Mobile App Development",
  "Web Application",
  "Fintech Platform",
  "Government Service",
  "NGO/Non-profit",
  "Banking Integration",
  "E-commerce",
  "Other",
];

export default function DeveloperSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<DeveloperFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    use_case: "",
    project: "",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.use_case) {
      newErrors.use_case = "Please select a use case";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create developer user with proper Supabase Auth
      const { user, error } = await createDeveloperUser(
        formData.email,
        formData.password,
        formData.name,
        formData.use_case
      );

      if (error) {
        console.error("Signup error:", error);
        if (
          error.message.includes("already registered") ||
          error.message.includes("already been registered") ||
          error.message.includes("already exists in database")
        ) {
          alert(
            "An account with this email already exists. Please sign in instead."
          );
        } else {
          alert("Failed to create developer account. Please try again.");
        }
        return;
      }

      if (user) {
        // Store user info in session for dashboard
        sessionStorage.setItem("user_id", user.id);
        sessionStorage.setItem("user_email", formData.email);
        sessionStorage.setItem("user_name", formData.name);
        sessionStorage.setItem("user_type", "developer");
        sessionStorage.setItem("api_key", user.api_key || "");

        toast.success("Account created successfully!", {
          description: "You can now log in with your credentials.",
        });

        // Redirect to login page instead of dashboard
        router.push("/developer-login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Failed to create developer account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundWrapper>
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Developer Access
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Get instant access to FaydaPass APIs and SDKs. Start building with
              government-backed KYC verification.
            </p>
          </div>

          {/* Quick Signup Form */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-white font-medium mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.name ? "border-red-500" : "border-white/20"
                    }`}
                    placeholder="John Doe"
                    required
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-white font-medium mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.email ? "border-red-500" : "border-white/20"
                    }`}
                    placeholder="john@company.com"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-white font-medium mb-2"
                  >
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12 ${
                        errors.password ? "border-red-500" : "border-white/20"
                      }`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-white font-medium mb-2"
                  >
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-white/20"
                      }`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="use_case"
                  className="block text-white font-medium mb-2"
                >
                  Use Case *
                </label>
                <select
                  id="use_case"
                  value={formData.use_case}
                  onChange={(e) =>
                    setFormData({ ...formData, use_case: e.target.value })
                  }
                  className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.use_case ? "border-red-500" : "border-white/20"
                  }`}
                  required
                >
                  <option value="">Select your use case</option>
                  {useCases.map((useCase) => (
                    <option key={useCase} value={useCase}>
                      {useCase}
                    </option>
                  ))}
                </select>
                {errors.use_case && (
                  <p className="text-red-400 text-sm mt-1">{errors.use_case}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="project"
                  className="block text-white font-medium mb-2"
                >
                  Project Description
                </label>
                <textarea
                  id="project"
                  value={formData.project}
                  onChange={(e) =>
                    setFormData({ ...formData, project: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Briefly describe your project..."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Creating Account..." : "Create Developer Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Already have an account?{" "}
                <a
                  href="/developer-login"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
