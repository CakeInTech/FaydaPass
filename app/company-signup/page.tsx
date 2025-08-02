"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Building, Eye, EyeOff } from "lucide-react";
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
  "NGO/Non-profit",
  "E-commerce",
  "Healthcare",
  "Education",
  "Insurance",
  "Real Estate",
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
  "100-1,000 verifications/month",
  "1,000-10,000 verifications/month",
  "10,000+ verifications/month",
];

const complianceOptions = [
  "KYC/AML Compliance",
  "GDPR Compliance",
  "PCI DSS Compliance",
  "SOC 2 Compliance",
  "ISO 27001 Compliance",
  "Local Regulatory Compliance",
];

export default function CompanySignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.company_name.trim()) {
        newErrors.company_name = "Company name is required";
      }
      if (!formData.contact_name.trim()) {
        newErrors.contact_name = "Contact name is required";
      }
      if (!formData.contact_email.trim()) {
        newErrors.contact_email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
        newErrors.contact_email = "Please enter a valid email";
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
    } else if (step === 2) {
      if (!formData.industry) {
        newErrors.industry = "Please select an industry";
      }
      if (!formData.employee_count) {
        newErrors.employee_count = "Please select employee count";
      }
      if (!formData.expected_volume) {
        newErrors.expected_volume = "Please select expected volume";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      // Create company first
      const company = await createCompany({
        name: formData.company_name,
        industry: formData.industry,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        website: formData.website,
        employee_count: formData.employee_count,
        use_case: formData.use_case,
        expected_volume: formData.expected_volume,
        compliance_requirements: formData.compliance_requirements,
        status: "pending",
      });

      if (company) {
        // Create company user with proper Supabase Auth
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
            alert(
              "An account with this email already exists. Please sign in instead."
            );
          } else {
            alert("Failed to create company account. Please try again.");
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
          sessionStorage.setItem("company_name", formData.company_name);
          sessionStorage.setItem("api_key", user.api_key || "");

          toast.success("Company registered successfully!", {
            description: "You can now log in with your credentials.",
          });

          // Redirect to login page instead of dashboard
          router.push("/company-login");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Failed to create company account. Please try again.");
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
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Company Registration
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Register your company to access FaydaPass KYC services for your
              business needs.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= 1
                      ? "bg-indigo-500 text-white"
                      : "bg-white/20 text-white/50"
                  }`}
                >
                  1
                </div>
                <span
                  className={`text-sm ${
                    currentStep >= 1 ? "text-white" : "text-white/50"
                  }`}
                >
                  Company Information
                </span>
              </div>
              <div className="flex-1 h-1 bg-white/20 mx-4"></div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= 2
                      ? "bg-indigo-500 text-white"
                      : "bg-white/20 text-white/50"
                  }`}
                >
                  2
                </div>
                <span
                  className={`text-sm ${
                    currentStep >= 2 ? "text-white" : "text-white/50"
                  }`}
                >
                  Business Details
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
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
                          errors.company_name
                            ? "border-red-500"
                            : "border-white/20"
                        }`}
                        placeholder="Your Company Ltd"
                        required
                      />
                      {errors.company_name && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.company_name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="contact_name"
                        className="block text-white font-medium mb-2"
                      >
                        Contact Person Name *
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
                          errors.contact_name
                            ? "border-red-500"
                            : "border-white/20"
                        }`}
                        placeholder="John Doe"
                        required
                      />
                      {errors.contact_name && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.contact_name}
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
                          errors.contact_email
                            ? "border-red-500"
                            : "border-white/20"
                        }`}
                        placeholder="john@company.com"
                        required
                      />
                      {errors.contact_email && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.contact_email}
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
                        placeholder="+251 911 123 456"
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
                            errors.password
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
                      htmlFor="website"
                      className="block text-white font-medium mb-2"
                    >
                      Company Website
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
                          errors.industry ? "border-red-500" : "border-white/20"
                        }`}
                        required
                      >
                        <option value="">Select Industry</option>
                        {industries.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                      {errors.industry && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.industry}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="employee_count"
                        className="block text-white font-medium mb-2"
                      >
                        Employee Count *
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
                        className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.employee_count
                            ? "border-red-500"
                            : "border-white/20"
                        }`}
                        required
                      >
                        <option value="">Select Employee Count</option>
                        {employeeCounts.map((count) => (
                          <option key={count} value={count}>
                            {count}
                          </option>
                        ))}
                      </select>
                      {errors.employee_count && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.employee_count}
                        </p>
                      )}
                    </div>
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
                      placeholder="Describe how you plan to use FaydaPass KYC services..."
                      rows={3}
                    />
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
                        errors.expected_volume
                          ? "border-red-500"
                          : "border-white/20"
                      }`}
                      required
                    >
                      <option value="">Select Expected Volume</option>
                      {expectedVolumes.map((volume) => (
                        <option key={volume} value={volume}>
                          {volume}
                        </option>
                      ))}
                    </select>
                    {errors.expected_volume && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.expected_volume}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Compliance Requirements
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {complianceOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-3"
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
                            className="w-4 h-4 text-indigo-600 bg-white/10 border-white/20 rounded focus:ring-indigo-500"
                          />
                          <span className="text-white/80 text-sm">
                            {option}
                          </span>
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
                    className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Back
                  </button>
                )}
                <div className="flex-1"></div>
                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
