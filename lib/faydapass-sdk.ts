/**
 * FaydaPass SDK for JavaScript/Node.js
 * Government-backed KYC verification powered by Fayda eSignet
 */

export interface FaydaPassConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface VerificationRequest {
  userEmail: string;
  redirectUrl?: string;
  metadata?: Record<string, any>;
}

export interface VerificationResponse {
  verificationId: string;
  authUrl: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  createdAt: string;
}

export interface VerificationStatus {
  verificationId: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  userEmail: string;
  faydaId?: string;
  verifiedAt?: string;
  metadata?: Record<string, any>;
  error?: string;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
}

export class FaydaPassError extends Error {
  public code: string;
  public status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'FaydaPassError';
    this.code = code;
    this.status = status;
  }
}

export class FaydaPass {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: FaydaPassConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.faydapass.com';
    this.timeout = config.timeout || 30000;

    if (!this.apiKey) {
      throw new FaydaPassError('API key is required', 'MISSING_API_KEY', 400);
    }
  }

  /**
   * Initiate a KYC verification
   */
  async initiateVerification(request: VerificationRequest): Promise<VerificationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/kyc/initiate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: request.userEmail,
          redirect_url: request.redirectUrl,
          metadata: request.metadata,
        }),
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new FaydaPassError(
          error.message || 'Failed to initiate verification',
          error.code || 'INITIATION_FAILED',
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof FaydaPassError) {
        throw error;
      }
      throw new FaydaPassError(
        error instanceof Error ? error.message : 'Network error',
        'NETWORK_ERROR',
        500
      );
    }
  }

  /**
   * Check verification status
   */
  async getVerificationStatus(verificationId: string): Promise<VerificationStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/api/kyc/status/${verificationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new FaydaPassError(
          error.message || 'Failed to get verification status',
          error.code || 'STATUS_CHECK_FAILED',
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof FaydaPassError) {
        throw error;
      }
      throw new FaydaPassError(
        error instanceof Error ? error.message : 'Network error',
        'NETWORK_ERROR',
        500
      );
    }
  }

  /**
   * List all verifications for the account
   */
  async listVerifications(options?: {
    limit?: number;
    offset?: number;
    status?: string;
    userEmail?: string;
  }): Promise<{
    verifications: VerificationStatus[];
    total: number;
    limit: number;
    offset: number;
  }> {
    try {
      const params = new URLSearchParams();
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());
      if (options?.status) params.append('status', options.status);
      if (options?.userEmail) params.append('user_email', options.userEmail);

      const response = await fetch(`${this.baseUrl}/api/kyc/verifications?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new FaydaPassError(
          error.message || 'Failed to list verifications',
          error.code || 'LIST_FAILED',
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof FaydaPassError) {
        throw error;
      }
      throw new FaydaPassError(
        error instanceof Error ? error.message : 'Network error',
        'NETWORK_ERROR',
        500
      );
    }
  }

  /**
   * Get account usage statistics
   */
  async getUsageStats(): Promise<{
    totalCalls: number;
    successRate: number;
    avgResponseTime: number;
    failedCalls: number;
    monthlyLimit: number;
    remainingCalls: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/usage`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new FaydaPassError(
          error.message || 'Failed to get usage stats',
          error.code || 'USAGE_CHECK_FAILED',
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof FaydaPassError) {
        throw error;
      }
      throw new FaydaPassError(
        error instanceof Error ? error.message : 'Network error',
        'NETWORK_ERROR',
        500
      );
    }
  }

  /**
   * Validate API key
   */
  async validateApiKey(): Promise<{
    valid: boolean;
    plan: string;
    permissions: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        return { valid: false, plan: '', permissions: [] };
      }

      return await response.json();
    } catch (error) {
      return { valid: false, plan: '', permissions: [] };
    }
  }
}

// Convenience function for quick verification
export async function verifyUser(
  apiKey: string,
  userEmail: string,
  options?: {
    redirectUrl?: string;
    metadata?: Record<string, any>;
    baseUrl?: string;
  }
): Promise<VerificationResponse> {
  const client = new FaydaPass({
    apiKey,
    baseUrl: options?.baseUrl,
  });

  return client.initiateVerification({
    userEmail,
    redirectUrl: options?.redirectUrl,
    metadata: options?.metadata,
  });
}

// Export types for external use
export type {
  FaydaPassConfig,
  VerificationRequest,
  VerificationResponse,
  VerificationStatus,
  ApiError,
};
