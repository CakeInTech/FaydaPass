// Simple FaydaPass SDK for MVP
// Always validates and returns mock data for presentation

export interface FaydaPassConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface VerificationRequest {
  user_email: string;
  redirect_url?: string;
}

export interface VerificationResponse {
  verification_id: string;
  auth_url: string;
  status: "pending";
}

export interface VerificationResult {
  verification_id: string;
  status: "success" | "failed";
  fayda_id?: string;
  user_data?: {
    name: string;
    email: string;
    phone?: string;
    fayda_id: string;
  };
  match_score?: number;
  liveness_score?: number;
  completed_at: string;
}

export class FaydaPass {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: FaydaPassConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || "https://api.faydapass.com";
  }

  // Initialize a KYC verification
  async initiateVerification(
    request: VerificationRequest
  ): Promise<VerificationResponse> {
    // Mock implementation - always returns success
    const verificationId = `vp_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return {
      verification_id: verificationId,
      auth_url: `${this.baseUrl}/verify/${verificationId}`,
      status: "pending",
    };
  }

  // Check verification status
  async getVerificationStatus(
    verificationId: string
  ): Promise<VerificationResult> {
    // Mock implementation - always returns success with mock data
    const mockUserData = {
      name: "Abebe Kebede",
      email: "abebe@example.com",
      phone: "+251 911 111 111",
      fayda_id: "FID123456789",
    };

    return {
      verification_id: verificationId,
      status: "success",
      fayda_id: mockUserData.fayda_id,
      user_data: mockUserData,
      match_score: 95.5,
      liveness_score: 98.2,
      completed_at: new Date().toISOString(),
    };
  }

  // Verify a user (simplified for MVP)
  async verifyUser(userEmail: string): Promise<VerificationResult> {
    const verificationId = `vp_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUserData = {
      name: "Demo User",
      email: userEmail,
      phone: "+251 911 000 000",
      fayda_id: `FID${Math.random().toString().substr(2, 9)}`,
    };

    return {
      verification_id: verificationId,
      status: "success",
      fayda_id: mockUserData.fayda_id,
      user_data: mockUserData,
      match_score: 95.5,
      liveness_score: 98.2,
      completed_at: new Date().toISOString(),
    };
  }

  // Get API usage stats (mock)
  async getUsageStats(): Promise<{
    total_verifications: number;
    successful_verifications: number;
    failed_verifications: number;
    api_calls_this_month: number;
  }> {
    return {
      total_verifications: 1247,
      successful_verifications: 1189,
      failed_verifications: 58,
      api_calls_this_month: 1567,
    };
  }

  // Validate API key (mock)
  async validateApiKey(): Promise<boolean> {
    // For MVP, always return true if API key format is correct
    return this.apiKey.startsWith("fp_");
  }
}

// Export a default instance for quick use
export const faydapass = new FaydaPass({
  apiKey: process.env.NEXT_PUBLIC_FAYDAPASS_API_KEY || "fp_demo_key",
});
