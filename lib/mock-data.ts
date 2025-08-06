// Mock data for FaydaPass MVP Dashboard

export interface MockCompany {
  id: string;
  name: string;
  email: string;
  role: "company" | "developer" | "admin";
  plan_type: "developer" | "business";
  api_key: string;
  created_at: string;
  stats: {
    totalVerifications: number;
    successfulVerifications: number;
    recentVerifications: number;
    apiCalls: number;
    successRate: number;
    monthlyLimit: number;
    remainingCalls: number;
  };
}

export interface MockVerification {
  id: string;
  user_email: string;
  status: "pending" | "processing" | "success" | "failed";
  type: "KYC" | "biometric";
  fayda_id?: string;
  match_score?: number;
  liveness_score?: number;
  created_at: string;
  completed_at?: string;
  company_name: string;
  user_data: {
    name?: string;
    phone?: string;
    source?: string;
  };
}

export interface MockApiUsage {
  id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time: number;
  created_at: string;
}

// Mock Companies Data
export const mockCompanies: MockCompany[] = [
  {
    id: "comp_001",
    name: "EthioBank PLC",
    email: "tech@ethiobank.com",
    role: "company",
    plan_type: "business",
    api_key: "fp_ethiobank_2025_abc123",
    created_at: "2024-12-15T10:30:00Z",
    stats: {
      totalVerifications: 2847,
      successfulVerifications: 2712,
      recentVerifications: 156,
      apiCalls: 3420,
      successRate: 95,
      monthlyLimit: 50000,
      remainingCalls: 46580,
    },
  },
  {
    id: "comp_002",
    name: "M-Pesa Ethiopia",
    email: "dev@mpesa.et",
    role: "company",
    plan_type: "business",
    api_key: "fp_mpesa_2025_def456",
    created_at: "2024-12-10T14:20:00Z",
    stats: {
      totalVerifications: 1893,
      successfulVerifications: 1789,
      recentVerifications: 89,
      apiCalls: 2156,
      successRate: 94,
      monthlyLimit: 50000,
      remainingCalls: 47844,
    },
  },
  {
    id: "comp_003",
    name: "Amhara Bank",
    email: "integration@amharabank.com",
    role: "company",
    plan_type: "business",
    api_key: "fp_amhara_2025_ghi789",
    created_at: "2024-12-05T09:15:00Z",
    stats: {
      totalVerifications: 1247,
      successfulVerifications: 1189,
      recentVerifications: 67,
      apiCalls: 1456,
      successRate: 95,
      monthlyLimit: 50000,
      remainingCalls: 48544,
    },
  },
  {
    id: "comp_004",
    name: "TechStart Ethiopia",
    email: "hello@techstart.et",
    role: "developer",
    plan_type: "developer",
    api_key: "fp_techstart_2025_jkl012",
    created_at: "2024-12-20T16:45:00Z",
    stats: {
      totalVerifications: 234,
      successfulVerifications: 218,
      recentVerifications: 23,
      apiCalls: 289,
      successRate: 93,
      monthlyLimit: 1000,
      remainingCalls: 711,
    },
  },
  {
    id: "comp_005",
    name: "Digital Ethiopia",
    email: "api@digitalethiopia.gov.et",
    role: "company",
    plan_type: "business",
    api_key: "fp_digital_2025_mno345",
    created_at: "2024-12-12T11:30:00Z",
    stats: {
      totalVerifications: 892,
      successfulVerifications: 847,
      recentVerifications: 45,
      apiCalls: 1023,
      successRate: 95,
      monthlyLimit: 50000,
      remainingCalls: 48977,
    },
  },
];

// Mock Verifications Data
export const mockVerifications: MockVerification[] = [
  {
    id: "ver_001",
    user_email: "abebe.tesfaye@gmail.com",
    status: "success",
    type: "KYC",
    fayda_id: "FAYDA_123456789",
    match_score: 98.5,
    liveness_score: 95.2,
    created_at: "2025-01-06T08:30:00Z",
    completed_at: "2025-01-06T08:32:15Z",
    company_name: "EthioBank PLC",
    user_data: {
      name: "Abebe Tesfaye",
      phone: "+251911234567",
      source: "mobile_app",
    },
  },
  {
    id: "ver_002",
    user_email: "kidist.haile@yahoo.com",
    status: "success",
    type: "KYC",
    fayda_id: "FAYDA_987654321",
    match_score: 97.8,
    liveness_score: 94.1,
    created_at: "2025-01-06T09:15:00Z",
    completed_at: "2025-01-06T09:17:30Z",
    company_name: "M-Pesa Ethiopia",
    user_data: {
      name: "Kidist Haile",
      phone: "+251922345678",
      source: "web_app",
    },
  },
  {
    id: "ver_003",
    user_email: "yohannes.dereje@hotmail.com",
    status: "processing",
    type: "KYC",
    created_at: "2025-01-06T10:00:00Z",
    company_name: "Amhara Bank",
    user_data: {
      name: "Yohannes Dereje",
      phone: "+251933456789",
      source: "mobile_app",
    },
  },
  {
    id: "ver_004",
    user_email: "bethel.tadesse@gmail.com",
    status: "failed",
    type: "KYC",
    created_at: "2025-01-06T10:45:00Z",
    completed_at: "2025-01-06T10:47:20Z",
    company_name: "TechStart Ethiopia",
    user_data: {
      name: "Bethel Tadesse",
      phone: "+251944567890",
      source: "web_app",
    },
  },
  {
    id: "ver_005",
    user_email: "dawit.mengistu@yahoo.com",
    status: "success",
    type: "KYC",
    fayda_id: "FAYDA_456789123",
    match_score: 99.1,
    liveness_score: 96.8,
    created_at: "2025-01-06T11:30:00Z",
    completed_at: "2025-01-06T11:32:45Z",
    company_name: "Digital Ethiopia",
    user_data: {
      name: "Dawit Mengistu",
      phone: "+251955678901",
      source: "mobile_app",
    },
  },
  {
    id: "ver_006",
    user_email: "meron.alemu@gmail.com",
    status: "pending",
    type: "KYC",
    created_at: "2025-01-06T12:15:00Z",
    company_name: "EthioBank PLC",
    user_data: {
      name: "Meron Alemu",
      phone: "+251966789012",
      source: "web_app",
    },
  },
  {
    id: "ver_007",
    user_email: "solomon.bekele@hotmail.com",
    status: "success",
    type: "KYC",
    fayda_id: "FAYDA_789123456",
    match_score: 98.9,
    liveness_score: 95.5,
    created_at: "2025-01-06T13:00:00Z",
    completed_at: "2025-01-06T13:02:30Z",
    company_name: "M-Pesa Ethiopia",
    user_data: {
      name: "Solomon Bekele",
      phone: "+251977890123",
      source: "mobile_app",
    },
  },
  {
    id: "ver_008",
    user_email: "hanna.girma@yahoo.com",
    status: "success",
    type: "KYC",
    fayda_id: "FAYDA_321654987",
    match_score: 97.2,
    liveness_score: 93.8,
    created_at: "2025-01-06T13:45:00Z",
    completed_at: "2025-01-06T13:47:15Z",
    company_name: "Amhara Bank",
    user_data: {
      name: "Hanna Girma",
      phone: "+251988901234",
      source: "web_app",
    },
  },
];

// Mock API Usage Data
export const mockApiUsage: MockApiUsage[] = [
  {
    id: "usage_001",
    endpoint: "/api/sdk/initiate-verification",
    method: "POST",
    status_code: 200,
    response_time: 245,
    created_at: "2025-01-06T08:30:00Z",
  },
  {
    id: "usage_002",
    endpoint: "/api/sdk/validate-key",
    method: "POST",
    status_code: 200,
    response_time: 89,
    created_at: "2025-01-06T08:31:00Z",
  },
  {
    id: "usage_003",
    endpoint: "/api/sdk/get-status",
    method: "POST",
    status_code: 200,
    response_time: 156,
    created_at: "2025-01-06T08:32:00Z",
  },
  {
    id: "usage_004",
    endpoint: "/api/sdk/initiate-verification",
    method: "POST",
    status_code: 200,
    response_time: 267,
    created_at: "2025-01-06T09:15:00Z",
  },
  {
    id: "usage_005",
    endpoint: "/api/sdk/get-status",
    method: "POST",
    status_code: 200,
    response_time: 134,
    created_at: "2025-01-06T09:17:00Z",
  },
  {
    id: "usage_006",
    endpoint: "/api/sdk/initiate-verification",
    method: "POST",
    status_code: 200,
    response_time: 289,
    created_at: "2025-01-06T10:00:00Z",
  },
  {
    id: "usage_007",
    endpoint: "/api/sdk/initiate-verification",
    method: "POST",
    status_code: 400,
    response_time: 123,
    created_at: "2025-01-06T10:45:00Z",
  },
  {
    id: "usage_008",
    endpoint: "/api/sdk/initiate-verification",
    method: "POST",
    status_code: 200,
    response_time: 234,
    created_at: "2025-01-06T11:30:00Z",
  },
];

// Helper functions
export const getCompanyById = (id: string) => {
  return mockCompanies.find((company) => company.id === id);
};

export const getVerificationsByCompany = (companyId: string) => {
  const company = getCompanyById(companyId);
  if (!company) return [];

  return mockVerifications.filter(
    (verification) => verification.company_name === company.name
  );
};

export const getApiUsageByCompany = (companyId: string) => {
  return mockApiUsage.slice(0, 10); // Return last 10 API calls
};

export const getOverallStats = () => {
  const totalCompanies = mockCompanies.length;
  const totalVerifications = mockVerifications.length;
  const successfulVerifications = mockVerifications.filter(
    (v) => v.status === "success"
  ).length;
  const totalApiCalls = mockApiUsage.length;

  return {
    totalCompanies,
    totalVerifications,
    successfulVerifications,
    totalApiCalls,
    successRate: Math.round(
      (successfulVerifications / totalVerifications) * 100
    ),
  };
};
