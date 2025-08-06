/**
 * FaydaPass JavaScript SDK Example
 *
 * This example demonstrates how to integrate FaydaPass KYC verification
 * into your JavaScript/Node.js application.
 */

class FaydaPassSDK {
  constructor(apiKey, baseUrl = 'https://api.faydapass.com') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Validate your API key
   */
  async validateApiKey() {
    try {
      const response = await fetch(`${this.baseUrl}/api/sdk/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          apiKey: this.apiKey
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate API key');
      }

      return data;
    } catch (error) {
      console.error('API Key validation failed:', error);
      throw error;
    }
  }

  /**
   * Initiate a KYC verification for a user
   */
  async initiateVerification(userEmail, redirectUrl) {
    try {
      const response = await fetch(`${this.baseUrl}/api/sdk/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          apiKey: this.apiKey,
          userEmail,
          redirectUrl
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate verification');
      }

      return data;
    } catch (error) {
      console.error('Verification initiation failed:', error);
      throw error;
    }
  }

  /**
   * Check the status of a verification
   */
  async getVerificationStatus(verificationId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/sdk/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          apiKey: this.apiKey,
          verificationId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get verification status');
      }

      return data;
    } catch (error) {
      console.error('Status check failed:', error);
      throw error;
    }
  }

  /**
   * List all verifications for your company
   */
  async listVerifications() {
    try {
      const response = await fetch(`${this.baseUrl}/api/sdk/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          apiKey: this.apiKey
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to list verifications');
      }

      return data;
    } catch (error) {
      console.error('List verifications failed:', error);
      throw error;
    }
  }

  /**
   * Get API usage statistics
   */
  async getUsageStats() {
    try {
      const response = await fetch(`${this.baseUrl}/api/sdk/usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          apiKey: this.apiKey
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get usage stats');
      }

      return data;
    } catch (error) {
      console.error('Usage stats failed:', error);
      throw error;
    }
  }
}

// Example usage
async function example() {
  // Initialize the SDK with your API key
  const faydaPass = new FaydaPassSDK('fp_ethiobank_2025_abc123');

  try {
    // 1. Validate your API key
    console.log('🔑 Validating API key...');
    const validation = await faydaPass.validateApiKey();
    console.log('✅ API key valid:', validation);

    // 2. Initiate a verification
    console.log('\n🚀 Initiating verification...');
    const verification = await faydaPass.initiateVerification(
      'user@example.com',
      'https://yourapp.com/callback'
    );
    console.log('✅ Verification initiated:', verification);

    // 3. Check verification status
    console.log('\n📊 Checking verification status...');
    const status = await faydaPass.getVerificationStatus(verification.verificationId);
    console.log('✅ Verification status:', status);

    // 4. List all verifications
    console.log('\n📋 Listing all verifications...');
    const verifications = await faydaPass.listVerifications();
    console.log('✅ Verifications:', verifications);

    // 5. Get usage statistics
    console.log('\n📈 Getting usage statistics...');
    const usage = await faydaPass.getUsageStats();
    console.log('✅ Usage stats:', usage);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Express.js integration example
function expressIntegration() {
  const express = require('express');
  const app = express();

  app.use(express.json());

  const faydaPass = new FaydaPassSDK('fp_ethiobank_2025_abc123');

  // Endpoint to start verification
  app.post('/verify', async (req, res) => {
    try {
      const { userEmail, redirectUrl } = req.body;

      const verification = await faydaPass.initiateVerification(userEmail, redirectUrl);

      res.json({
        success: true,
        verificationId: verification.verificationId,
        redirectUrl: verification.redirectUrl
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // Endpoint to check verification status
  app.get('/verify/:verificationId', async (req, res) => {
    try {
      const { verificationId } = req.params;

      const status = await faydaPass.getVerificationStatus(verificationId);

      res.json({
        success: true,
        status
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // Callback endpoint
  app.get('/callback', (req, res) => {
    const { verificationId, status } = req.query;

    console.log(`Verification ${verificationId} completed with status: ${status}`);

    // Handle the callback - update your database, notify user, etc.
    res.json({
      success: true,
      message: 'Verification callback received'
    });
  });

  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}

// Run the example
if (require.main === module) {
  example();
}

module.exports = FaydaPassSDK;
