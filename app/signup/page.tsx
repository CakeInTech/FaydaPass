"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Code,
  Building2,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import Link from "next/link";

// Define types locally
type PlanType = 'developer' | 'business';
type UserRole = 'admin' | 'developer' | 'company';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company_name?: string;
  industry?: string;
  use_case?: string;
  project_description?: string;
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planType = (searchParams.get('plan') as PlanType) || 'developer';
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company_name: '',
    industry: '',
    use_case: '',
    project_description: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const industries = [
    'Banking & Financial Services',
    'Fintech',
    'Government',
    'Healthcare',
    'E-commerce',
    'Real Estate',
    'Insurance',
    'Education',
    'NGO/Non-profit',
    'Other',
  ];

  const useCases = [
    'Mobile App Development',
    'Web Application',
    'Fintech Platform',
    'Government Service',
    'Banking Integration',
    'E-commerce Platform',
    'Customer Onboarding',
    'Identity Verification',
    'Other',
  ];

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) {
      newErrors.push('Name is required');
    }

    if (!formData.email.trim()) {
      newErrors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push('Please enter a valid email address');
    }

    if (!formData.password) {
      newErrors.push('Password is required');
    } else if (formData.password.length < 8) {
      newErrors.push('Password must be at least 8 characters');
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match');
    }

    if (planType === 'business' && !formData.company_name?.trim()) {
      newErrors.push('Company name is required for business plan');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const role: UserRole = planType === 'business' ? 'company' : 'developer';
      
      // Make API call to signup endpoint
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userData: {
            name: formData.name,
            role,
            plan_type: planType,
            company_name: formData.company_name,
            metadata: {
              industry: formData.industry,
              use_case: formData.use_case,
              project_description: formData.project_description,
              onboarding_completed: false,
            }
          }
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Signup error:', result.error);
        toast.error('Signup failed', {
          description: result.error,
        });
        return;
      }

      if (result.data) {
        toast.success('Account created successfully!', {
          description: 'Welcome to FaydaPass! Redirecting to your dashboard...',
        });

        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const planConfig = plans.find(p => p.id === planType);

  return (
    <BackgroundWrapper>
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Link href="/plan-selection">
              <Button variant="ghost" className="text-white/70 hover:text-white mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Plans
              </Button>
            </Link>

            <div className={`w-16 h-16 bg-gradient-to-br ${planConfig?.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              {planConfig?.icon}
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Create Your {planConfig?.name}
            </h1>
            <p className="text-xl text-white/80">
              {planConfig?.description}
            </p>
          </motion.div>

          {/* Signup Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-white font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="password" className="text-white font-medium">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-white font-medium">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Plan-specific fields */}
              {planType === 'business' && (
                <>
                  <div>
                    <Label htmlFor="company_name" className="text-white font-medium">
                      Company Name *
                    </Label>
                    <Input
                      id="company_name"
                      type="text"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="Your Company Ltd."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="industry" className="text-white font-medium">
                      Industry
                    </Label>
                    <select
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select your industry</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry} className="bg-gray-800">
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="use_case" className="text-white font-medium">
                  Use Case {planType === 'developer' ? '*' : ''}
                </Label>
                <select
                  id="use_case"
                  value={formData.use_case}
                  onChange={(e) => setFormData({ ...formData, use_case: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required={planType === 'developer'}
                >
                  <option value="">Select your use case</option>
                  {useCases.map((useCase) => (
                    <option key={useCase} value={useCase} className="bg-gray-800">
                      {useCase}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="project_description" className="text-white font-medium">
                  {planType === 'business' ? 'Business Description' : 'Project Description'}
                </Label>
                <textarea
                  id="project_description"
                  value={formData.project_description}
                  onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={`Briefly describe your ${planType === 'business' ? 'business' : 'project'}...`}
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  planType === 'business'
                    ? 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                }`}
              >
                {loading ? (
                  'Creating Account...'
                ) : (
                  <>
                    Create {planConfig?.name}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <BackgroundWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </BackgroundWrapper>
    }>
      <SignupContent />
    </Suspense>
  );
}