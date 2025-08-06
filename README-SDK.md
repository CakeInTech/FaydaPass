# FaydaPass SDK

Government-backed KYC verification powered by Fayda eSignet for JavaScript/Node.js applications.

## 🚀 Quick Start

### Installation

```bash
npm install @faydapass/sdk
```

### Basic Usage

```javascript
const { FaydaPass } = require("@faydapass/sdk");

// Initialize the SDK
const faydapass = new FaydaPass({
  apiKey: "fp_your_api_key_here",
  baseUrl: "https://api.faydapass.com", // Optional
  timeout: 30000, // Optional, defaults to 30 seconds
});

// Initiate a KYC verification
const verification = await faydapass.initiateVerification({
  userEmail: "user@example.com",
  redirectUrl: "https://yourapp.com/kyc/callback",
  metadata: {
    source: "web_app",
    user_id: "12345",
  },
});

console.log("Verification ID:", verification.verificationId);
console.log("Auth URL:", verification.authUrl);
```

## 📚 API Reference

### Constructor

```javascript
new FaydaPass(config);
```

**Parameters:**

- `config.apiKey` (string, required): Your FaydaPass API key
- `config.baseUrl` (string, optional): API base URL (defaults to `https://api.faydapass.com`)
- `config.timeout` (number, optional): Request timeout in milliseconds (defaults to 30000)

### Methods

#### `initiateVerification(request)`

Initiates a new KYC verification for a user.

**Parameters:**

- `request.userEmail` (string, required): User's email address
- `request.redirectUrl` (string, optional): URL to redirect after verification
- `request.metadata` (object, optional): Additional metadata

**Returns:** `Promise<VerificationResponse>`

```javascript
const verification = await faydapass.initiateVerification({
  userEmail: "user@example.com",
  redirectUrl: "https://yourapp.com/kyc/callback",
  metadata: {
    source: "mobile_app",
    user_id: "12345",
  },
});
```

#### `getVerificationStatus(verificationId)`

Checks the status of a verification.

**Parameters:**

- `verificationId` (string, required): The verification ID

**Returns:** `Promise<VerificationStatus>`

```javascript
const status = await faydapass.getVerificationStatus("vp_123456789");
console.log("Status:", status.status); // 'pending' | 'processing' | 'success' | 'failed'
```

#### `listVerifications(options)`

Lists all verifications for your account.

**Parameters:**

- `options.limit` (number, optional): Number of verifications to return
- `options.offset` (number, optional): Number of verifications to skip
- `options.status` (string, optional): Filter by status
- `options.userEmail` (string, optional): Filter by user email

**Returns:** `Promise<{ verifications: VerificationStatus[], total: number, limit: number, offset: number }>`

```javascript
const verifications = await faydapass.listVerifications({
  limit: 10,
  offset: 0,
  status: "success",
});
```

#### `getUsageStats()`

Gets usage statistics for your account.

**Returns:** `Promise<UsageStats>`

```javascript
const stats = await faydapass.getUsageStats();
console.log("Total calls:", stats.totalCalls);
console.log("Success rate:", stats.successRate + "%");
```

#### `validateApiKey()`

Validates your API key and returns account information.

**Returns:** `Promise<{ valid: boolean, plan: string, permissions: string[] }>`

```javascript
const validation = await faydapass.validateApiKey();
console.log("Valid:", validation.valid);
console.log("Plan:", validation.plan);
```

## 🔧 Error Handling

The SDK throws `FaydaPassError` for all API errors:

```javascript
try {
  const verification = await faydapass.initiateVerification({
    userEmail: "user@example.com",
  });
} catch (error) {
  if (error instanceof FaydaPassError) {
    console.error("Error:", error.message);
    console.error("Code:", error.code);
    console.error("Status:", error.status);
  }
}
```

## 📋 Types

### VerificationRequest

```typescript
interface VerificationRequest {
  userEmail: string;
  redirectUrl?: string;
  metadata?: Record<string, any>;
}
```

### VerificationResponse

```typescript
interface VerificationResponse {
  verificationId: string;
  authUrl: string;
  status: "pending" | "processing" | "success" | "failed";
  createdAt: string;
}
```

### VerificationStatus

```typescript
interface VerificationStatus {
  verificationId: string;
  status: "pending" | "processing" | "success" | "failed";
  userEmail: string;
  faydaId?: string;
  verifiedAt?: string;
  metadata?: Record<string, any>;
  error?: string;
}
```

## 🌐 Web Integration

### Redirect Flow

1. Initiate verification and get the auth URL
2. Redirect user to the auth URL
3. User completes verification on FaydaPass
4. User is redirected back to your app
5. Check verification status using the verification ID

```javascript
// 1. Initiate verification
const verification = await faydapass.initiateVerification({
  userEmail: "user@example.com",
  redirectUrl: "https://yourapp.com/kyc/callback",
});

// 2. Redirect user to auth URL
window.location.href = verification.authUrl;

// 3. In your callback page, check status
const status = await faydapass.getVerificationStatus(verificationId);
if (status.status === "success") {
  console.log("Verification successful!");
  console.log("Fayda ID:", status.faydaId);
}
```

## 🔒 Security

- API keys are automatically included in all requests
- All requests use HTTPS
- Timeout protection prevents hanging requests
- Input validation on all parameters

## 📞 Support

- **Documentation:** [https://docs.faydapass.com](https://docs.faydapass.com)
- **API Reference:** [https://api.faydapass.com/docs](https://api.faydapass.com/docs)
- **Support:** [support@faydapass.com](mailto:support@faydapass.com)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
