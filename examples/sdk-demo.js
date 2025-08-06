/**
 * FaydaPass SDK Demo
 *
 * This is a demonstration of how the FaydaPass SDK would work.
 * Since we're in a Next.js environment, this shows the expected behavior.
 */

// Mock SDK class for demonstration
class FaydaPassDemo {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.faydapass.com';
    this.timeout = config.timeout || 30000;
  }

  async validateApiKey() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      valid: this.apiKey.startsWith('fp_'),
      plan: this.apiKey.startsWith('fp_demo') ? 'developer' : 'business',
      permissions: ['kyc_verify', 'kyc_status', 'kyc_list', 'usage_stats']
    };
  }

  async initiateVerification(request) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const verificationId = `vp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      verificationId,
      authUrl: `${this.baseUrl}/verify/${verificationId}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  }

  async getVerificationStatus(verificationId) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      verificationId,
      status: 'success',
      userEmail: 'user@example.com',
      faydaId: `FID${Math.random().toString().substr(2, 9)}`,
      verifiedAt: new Date().toISOString(),
      metadata: {
        source: 'demo',
        timestamp: new Date().toISOString()
      }
    };
  }

  async listVerifications(options = {}) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));

    const mockVerifications = [
      {
        verificationId: 'vp_123456789',
        status: 'success',
        userEmail: 'user1@example.com',
        faydaId: 'FID123456789',
        verifiedAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        verificationId: 'vp_987654321',
        status: 'pending',
        userEmail: 'user2@example.com',
        verifiedAt: null
      }
    ];

    return {
      verifications: mockVerifications.slice(0, options.limit || 10),
      total: mockVerifications.length,
      limit: options.limit || 10,
      offset: options.offset || 0
    };
  }

  async getUsageStats() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));

    return {
      totalCalls: 1247,
      successRate: 95.5,
      avgResponseTime: 245,
      failedCalls: 58,
      monthlyLimit: 50000,
      remainingCalls: 48753
    };
  }
}

async function main() {
  console.log('🚀 FaydaPass SDK Demo\n');

  // Initialize the SDK
  const faydapass = new FaydaPassDemo({
    apiKey: 'fp_demo_key_123456',
    baseUrl: 'https://api.faydapass.com',
    timeout: 30000,
  });

  try {
    // 1. Validate API key
    console.log('1. Validating API key...');
    const validation = await faydapass.validateApiKey();
    console.log('✅ API Key valid:', validation.valid);
    console.log('📋 Plan:', validation.plan);
    console.log('🔑 Permissions:', validation.permissions);
    console.log('');

    // 2. Initiate a verification
    console.log('2. Initiating KYC verification...');
    const verification = await faydapass.initiateVerification({
      userEmail: 'user@example.com',
      redirectUrl: 'https://yourapp.com/kyc/callback',
      metadata: {
        source: 'node_demo',
        user_id: '12345',
        timestamp: new Date().toISOString(),
      },
    });
    console.log('✅ Verification initiated:', verification.verificationId);
    console.log('🔗 Auth URL:', verification.authUrl);
    console.log('📊 Status:', verification.status);
    console.log('');

    // 3. Check verification status
    console.log('3. Checking verification status...');
    const status = await faydapass.getVerificationStatus(verification.verificationId);
    console.log('📊 Status:', status.status);
    console.log('👤 User Email:', status.userEmail);
    if (status.faydaId) {
      console.log('🆔 Fayda ID:', status.faydaId);
    }
    console.log('');

    // 4. List verifications
    console.log('4. Listing verifications...');
    const verifications = await faydapass.listVerifications({
      limit: 5,
      offset: 0,
    });
    console.log('📋 Total verifications:', verifications.total);
    console.log('📄 Showing:', verifications.verifications.length);
    console.log('');

    // 5. Get usage statistics
    console.log('5. Getting usage statistics...');
    const usage = await faydapass.getUsageStats();
    console.log('📊 Total calls:', usage.totalCalls);
    console.log('✅ Success rate:', usage.successRate + '%');
    console.log('⚡ Avg response time:', usage.avgResponseTime + 'ms');
    console.log('❌ Failed calls:', usage.failedCalls);
    console.log('📈 Monthly limit:', usage.monthlyLimit);
    console.log('🔄 Remaining calls:', usage.remainingCalls);
    console.log('');

    console.log('🎉 All SDK operations completed successfully!');
    console.log('\n📝 This is a demo showing how the SDK would work.');
    console.log('🔗 Visit http://localhost:3000/sdk-test for interactive testing.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Quick verification function
async function quickVerify(userEmail) {
  try {
    const faydapass = new FaydaPassDemo({
      apiKey: 'fp_demo_key_123456',
    });

    const result = await faydapass.initiateVerification({
      userEmail,
      redirectUrl: 'https://yourapp.com/kyc/callback',
    });

    console.log('✅ Quick verification initiated:', result.verificationId);
    return result;
  } catch (error) {
    console.error('❌ Quick verification failed:', error.message);
    throw error;
  }
}

// Export functions for use in other files
module.exports = {
  FaydaPassDemo,
  main,
  quickVerify,
};

// Run the demo if this file is executed directly
if (require.main === module) {
  main();
}
