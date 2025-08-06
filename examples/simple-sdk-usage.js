/**
 * Simple FaydaPass SDK Usage Example
 *
 * This example shows how to use the FaydaPass SDK in a Node.js application.
 *
 * To run this example:
 * 1. Make sure you have the SDK installed: npm install @faydapass/sdk
 * 2. Set your API key in the environment: export FAYDAPASS_API_KEY="your_api_key"
 * 3. Run: node examples/simple-sdk-usage.js
 */

const { FaydaPass } = require('../lib/faydapass-sdk.ts');

async function main() {
  console.log('🚀 FaydaPass SDK Simple Example\n');

  // Initialize the SDK
  const faydapass = new FaydaPass({
    apiKey: process.env.FAYDAPASS_API_KEY || 'fp_demo_key_123456',
    baseUrl: 'https://api.faydapass.com', // Change this to your API URL
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
        source: 'node_example',
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

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('🔍 Error Code:', error.code);
    }
    if (error.status) {
      console.error('📊 HTTP Status:', error.status);
    }
  }
}

// Quick verification function
async function quickVerify(userEmail) {
  try {
    const faydapass = new FaydaPass({
      apiKey: process.env.FAYDAPASS_API_KEY || 'fp_demo_key_123456',
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
  main,
  quickVerify,
};

// Run the example if this file is executed directly
if (require.main === module) {
  main();
}
