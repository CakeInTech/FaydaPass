/**
 * FaydaPass SDK Usage Examples
 *
 * This file demonstrates how to use the FaydaPass SDK for KYC verification.
 * Make sure to install the SDK first: npm install @faydapass/sdk
 */

const { FaydaPass } = require('@faydapass/sdk');

// Initialize the SDK with your API key
const faydapass = new FaydaPass({
  apiKey: 'fp_your_api_key_here',
  baseUrl: 'https://api.faydapass.com', // Optional, defaults to this
  timeout: 30000, // Optional, defaults to 30 seconds
});

async function exampleUsage() {
  try {
    console.log('🚀 FaydaPass SDK Examples\n');

    // 1. Validate your API key
    console.log('1. Validating API key...');
    const validation = await faydapass.validateApiKey();
    console.log('✅ API Key valid:', validation.valid);
    console.log('📋 Plan:', validation.plan);
    console.log('🔑 Permissions:', validation.permissions);
    console.log('');

    // 2. Initiate a KYC verification
    console.log('2. Initiating KYC verification...');
    const verification = await faydapass.initiateVerification({
      userEmail: 'user@example.com',
      redirectUrl: 'https://yourapp.com/kyc/callback',
      metadata: {
        source: 'web_app',
        user_id: '12345',
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

    // 4. List all verifications
    console.log('4. Listing verifications...');
    const verifications = await faydapass.listVerifications({
      limit: 10,
      offset: 0,
      status: 'success',
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

    console.log('🎉 All examples completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('🔍 Code:', error.code);
    console.error('📊 Status:', error.status);
  }
}

// Quick verification function
async function quickVerify(userEmail) {
  try {
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

// Export for use in other files
module.exports = {
  faydapass,
  exampleUsage,
  quickVerify,
};

// Run examples if this file is executed directly
if (require.main === module) {
  exampleUsage();
}
