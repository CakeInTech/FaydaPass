"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Eye, EyeOff } from "lucide-react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import { createCompany, createCompanyUser } from "@/lib/supabase";
import { toast } from "sonner";

interface CompanyFormData {
  company_name: string;
  contact_name: string;
  contact_email: string;
  password: string;
  confirmPassword: string;
  contact_phone: string;
  website: string;
  industry: string;
  employee_count: string;
  use_case: string;
  expected_volume: string;
  compliance_requirements: string[];
}

const industries = [
  "Banking & Financial Services",
  "Fintech",
  "Government",
  "Healthcare",
  "E-commerce",
  "Real Estate",
  "Insurance",
  "Education",
  "NGO/Non-profit",
  "Other",
];

const employeeCounts = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "500+ employees",
];

const expectedVolumes = [
  "1-100 verifications/month",
  "100-500 verifications/month",
  "500-1000 verifications/month",
  "1000+ verifications/month",
];

const complianceOptions = [
  "KYC/AML Compliance",
  "GDPR Compliance",
  "SOC 2 Compliance",
  "ISO 27001",
  "PCI DSS",
  "Other Regulatory Requirements",
];

export default function CompanySignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState<CompanyFormData>({
    company_name: "",
    contact_name: "",
    contact_email: "",
    password: "",
    confirmPassword: "",
    contact_phone: "",
    website: "",
    industry: "",
    employee_count: "",
    use_case: "",
    expected_volume: "",
    compliance_requirements: [],
  });

  const validateStep = (step: number) => {
    const errors: string[] = [];

    if (step === 1) {
      if (!formData.company_name.trim()) {
        errors.push("Company name is required");
      }
      if (!formData.contact_name.trim()) {
        errors.push("Contact name is required");
      }
      if (!formData.contact_email.trim()) {
        errors.push("Contact email is required");
      } else {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.contact_email)) {
          errors.push("Please enter a valid email address");
        }
      }
      if (!formData.password) {
        errors.push("Password is required");
      } else if (formData.password.length < 6) {
        errors.push("Password must be at least 6 characters");
      }
      if (formData.password !== formData.confirmPassword) {
        errors.push("Passwords do not match");
      }
    } else if (step === 2) {
      if (!formData.industry) {
        errors.push("Please select an industry");
      }
      if (!formData.expected_volume) {
        errors.push("Please select expected volume");
      }
    }

    setErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);

    try {
      // First create the company
      const company = await createCompany({
        name: formData.company_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        website: formData.website,
        industry: formData.industry,
        employee_count: formData.employee_count,
        use_case: formData.use_case,
        expected_volume: formData.expected_volume,
        compliance_requirements: formData.compliance_requirements,
        status: "pending",
      });

      if (!company) {
        toast.error("Failed to create company", {
          description: "Please try again.",
        });
        return;
      }

      // Then create the company user
      const { user, error } = await createCompanyUser(
        formData.contact_email,
        formData.password,
        formData.contact_name,
        company.id,
        formData.company_name
      );

      if (error) {
        console.error("Signup error:", error);
        if (
          error.message.includes("already registered") ||
          error.message.includes("already been registered") ||
          error.message.includes("already exists in database")
        ) {
          toast.error("Account already exists", {
            description:
              "An account with this email already exists. Please sign in instead.",
          });
        } else {
          toast.error("Signup failed", {
            description: error.message,
          });
        }
        return;
      }

      if (user) {
        // Store user info in session for dashboard
        sessionStorage.setItem("user_id", user.id);
        sessionStorage.setItem("user_email", formData.contact_email);
        sessionStorage.setItem("user_name", formData.contact_name);
        sessionStorage.setItem("user_type", "company_user");
        sessionStorage.setItem("company_id", company.id);
        sessionStorage.setItem("api_key", user.api_key || "");

        toast.success("Company registered successfully!", {
          description: "You can now log in with your credentials.",
        });

        // Redirect to login page instead of dashboard
        router.push("/company-login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed", {
        description: "Failed to create company account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundWrapper>
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Company Registration
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Register your company to access FaydaPass KYC services and
              integrate government-backed identity verification.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= 1
                    ? "bg-indigo-500 text-white"
                    : "bg-white/20 text-white/60"
                }`}
              >
                1
              </div>
              <div
                className={`w-16 h-1 ${
                  currentStep >= 2 ? "bg-indigo-500" : "bg-white/20"
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= 2
                    ? "bg-indigo-500 text-white"
                    : "bg-white/20 text-white/60"
                }`}
              >
                2
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="company_name"
                        className="block text-white font-medium mb-2"
                      >
                        Company Name *
                      </label>
                      <input
                        id="company_name"
                        type="text"
                        value={formData.company_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            company_name: e.target.value,
                          })
                        }
                        className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.includes("Company name is required")
                            ? "border-red-500"
                            : "border-white/20"
                        }`}
                        placeholder="Your Company Ltd."
                        required
                      />
                      {errors.includes("Company name is required") && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.find(
                            (err) => err === "Company name is required"
                          )}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="contact_name"
                        className="block text-white font-medium mb-2"
                      >
                        Contact Name *
                      </label>
                      <input
                        id="contact_name"
                        type="text"
                        value={formData.contact_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact_name: e.target.value,
                          })
                        }
                        className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.includes("Contact name is required")
                            ? "border-red-500"
                            : "border-white/20"
                        }`}
                        placeholder="John Doe"
                        required
                      />
                      {errors.includes("Contact name is required") && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.find(
                            (err) => err === "Contact name is required"
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="contact_email"
                        className="block text-white font-medium mb-2"
                      >
                        Contact Email *
                      </label>
                      <input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact_email: e.target.value,
                          })
                        }
                        className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.includes("Contact email is required") ||
                          errors.includes("Please enter a valid email address")
                            ? "border-red-500"
                            : "border-white/20"
                        }`}
                        placeholder="contact@company.com"
                        required
                      />
                      {errors.includes("Contact email is required") && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.find(
                            (err) => err === "Contact email is required"
                          )}
                        </p>
                      )}
                      {errors.includes(
                        "Please enter a valid email address"
                      ) && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.find(
                            (err) =>
                              err === "Please enter a valid email address"
                          )}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="contact_phone"
                        className="block text-white font-medium mb-2"
                      >
                        Contact Phone
                      </label>
                      <input
                        id="contact_phone"
                        type="tel"
                        value={formData.contact_phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact_phone: e.target.value,
                          })
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="+1234567890"
                      />
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
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12 ${
                            errors.includes("Password is required") ||
                            errors.includes(
                              "Password must be at least 6 characters"
                            )
                              ? "border-red-500"
                              : "border-white/20"
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
                      {errors.includes("Password is required") && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.find((err) => err === "Password is required")}
                        </p>
                      )}
                      {errors.includes(
                        "Password must be at least 6 characters"
                      ) && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.find(
                            (err) =>
                              err === "Password must be at least 6 characters"
                          )}
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
                            errors.includes("Passwords do not match")
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
                      {errors.includes("Passwords do not match") && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.find(
                            (err) => err === "Passwords do not match"
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="website"
                      className="block text-white font-medium mb-2"
                    >
                      Website
                    </label>
                    <input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="industry"
                        className="block text-white font-medium mb-2"
                      >
                        Industry *
                      </label>
                      <select
                        id="industry"
                        value={formData.industry}
                        onChange={(e) =>
                          setFormData({ ...formData, industry: e.target.value })
                        }
                        className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.includes("Please select an industry")
                            ? "border-red-500"
                            : "border-white/20"
                        }`}
                        required
                      >
                        <option value="">Select your industry</option>
                        {industries.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                      {errors.includes("Please select an industry") && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.find(
                            (err) => err === "Please select an industry"
                          )}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="employee_count"
                        className="block text-white font-medium mb-2"
                      >
                        Employee Count
                      </label>
                      <select
                        id="employee_count"
                        value={formData.employee_count}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            employee_count: e.target.value,
                          })
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select employee count</option>
                        {employeeCounts.map((count) => (
                          <option key={count} value={count}>
                            {count}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="expected_volume"
                      className="block text-white font-medium mb-2"
                    >
                      Expected Verification Volume *
                    </label>
                    <select
                      id="expected_volume"
                      value={formData.expected_volume}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expected_volume: e.target.value,
                        })
                      }
                      className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.includes("Please select expected volume")
                          ? "border-red-500"
                          : "border-white/20"
                      }`}
                      required
                    >
                      <option value="">Select expected volume</option>
                      {expectedVolumes.map((volume) => (
                        <option key={volume} value={volume}>
                          {volume}
                        </option>
                      ))}
                    </select>
                    {errors.includes("Please select expected volume") && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.find(
                          (err) => err === "Please select expected volume"
                        )}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="use_case"
                      className="block text-white font-medium mb-2"
                    >
                      Use Case
                    </label>
                    <textarea
                      id="use_case"
                      value={formData.use_case}
                      onChange={(e) =>
                        setFormData({ ...formData, use_case: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Describe how you plan to use FaydaPass..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Compliance Requirements
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {complianceOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2 text-white"
                        >
                          <input
                            type="checkbox"
                            checked={formData.compliance_requirements.includes(
                              option
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  compliance_requirements: [
                                    ...formData.compliance_requirements,
                                    option,
                                  ],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  compliance_requirements:
                                    formData.compliance_requirements.filter(
                                      (req) => req !== option
                                    ),
                                });
                              }
                            }}
                            className="rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-indigo-500"
                          />
                          <span className="text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Back
                  </button>
                )}
                <div className="flex-1"></div>
                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? "Creating Account..." : "Create Company Account"}
                  </button>
                )}
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Already have an account?{" "}
                <a
                  href="/company-login"
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
