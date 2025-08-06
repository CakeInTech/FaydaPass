import { Code, Building2 } from "lucide-react";

export interface Plan {
  id: "developer" | "business";
  name: string;
  description: string;
  price: string;
  period: string;
  icon: any;
  gradient: string;
  features: string[];
  highlights: string[];
  popular?: boolean;
}

export const plans: Plan[] = [
  {
    id: "developer",
    name: "Developer Plan",
    description: "Perfect for individual developers and small projects",
    price: "Free",
    period: "forever",
    icon: Code,
    gradient: "from-blue-500 to-purple-600",
    features: [
      "1,000 API calls/month",
      "Complete SDK access",
      "Sandbox environment",
      "Community support",
      "Basic analytics",
      "Email notifications",
    ],
    highlights: [
      "Instant API access",
      "No credit card required",
      "Perfect for testing",
    ],
  },
  {
    id: "business",
    name: "Business Plan",
    description: "For companies, startups, and production applications",
    price: "$299",
    period: "/month",
    icon: Building2,
    gradient: "from-green-500 to-blue-600",
    features: [
      "50,000 API calls/month",
      "Advanced KYC features",
      "Webhook support",
      "Priority support",
      "Custom branding",
      "Advanced analytics",
      "Compliance reporting",
      "Multi-user access",
    ],
    highlights: [
      "Production ready",
      "Enterprise features",
      "Dedicated support",
    ],
    popular: true,
  },
];
