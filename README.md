# FaydaPass - Secure KYC Onboarding

A modern, responsive KYC onboarding web application built with Next.js, integrating with Fayda's eSignet OIDC system for secure Ethiopian identity verification.

## 🌟 Features

- **✅ Complete OIDC Integration**: Full OAuth 2.0 flow with Fayda eSignet working end-to-end
- **✅ Modern UI/UX**: Clean, responsive design with smooth animations and interactive elements
- **✅ Secure Authentication**: Bank-grade security with PKCE, client assertions, and JWT validation
- **✅ Real-time Verification**: Complete KYC verification in under 60 seconds
- **✅ Mobile-First Design**: Fully responsive across all device sizes
- **✅ Comprehensive Error Handling**: Robust error states, validation, and user feedback
- **✅ User Dashboard**: Post-verification dashboard with user information display
- **✅ Admin Interface**: User management and analytics dashboard

## 🚀 Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Shadcn/ui Components** for UI elements
- **Lucide React Icons** for iconography
- **Jose** for JWT handling
- **PKCE** implementation for OAuth security

## 🎯 Current Status

### ✅ Completed Features

1. **Full OIDC Integration**

   - ✅ Authorization flow with PKCE
   - ✅ Token exchange with client assertion
   - ✅ UserInfo endpoint integration (POST method with form data)
   - ✅ JWT token validation and decoding
   - ✅ State parameter validation for security

2. **User Interface**

   - ✅ Landing page with hero section
   - ✅ Verification flow pages
   - ✅ OAuth callback handling
   - ✅ Success/verified page with user data display
   - ✅ Error handling and user feedback
   - ✅ Responsive design across all breakpoints

3. **Security Implementation**

   - ✅ PKCE (Proof Key for Code Exchange)
   - ✅ Client assertion with JWT signing
   - ✅ Secure token storage in sessionStorage
   - ✅ CSRF protection with state validation
   - ✅ Proper error handling for OAuth flows

4. **Admin Dashboard**
   - ✅ User management interface
   - ✅ Analytics and statistics
   - ✅ User detail pages
   - ✅ Data export functionality

### 🔧 Technical Achievements

- **Solved UserInfo 401 Error**: Implemented multiple request strategies to handle Fayda's specific API requirements
- **Prevented Token Reuse**: Fixed duplicate token exchange requests with proper state management
- **JWT Client Assertion**: Successfully implemented RS256 JWT signing for client authentication
- **Multi-language Support**: Handles both English and Amharic user data from Fayda

## 🛠 Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file with the following Fayda eSignet OIDC configuration:

```env
# 🌐 Fayda eSignet OIDC Configuration
NEXT_PUBLIC_CLIENT_ID=crXYIYg2cJiNTaw5t-peoPzCRo-3JATNfBd5A86U8t0
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_AUTHORIZATION_ENDPOINT=https://esignet.ida.fayda.et/authorize
NEXT_PUBLIC_TOKEN_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token
NEXT_PUBLIC_USERINFO_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oidc/userinfo
NEXT_PUBLIC_ALGORITHM=RS256
NEXT_PUBLIC_CLIENT_ASSERTION_TYPE=urn:ietf:params:oauth:client-assertion-type:jwt-bearer

# 🧠 FaydaPass App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 🔐 JWT Signing (Required for client assertion)
TOKEN_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token
CLIENT_ASSERTION_TYPE=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
PRIVATE_KEY=[Your base64-encoded JWK private key]
```

### 2. Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:3000` to see the application.

### 3. Testing the Integration

Use these test credentials on the Fayda eSignet page:

- **FIN**: `6140798523917519`
- **OTP**: `111111`

## 🔄 Complete OIDC Flow Implementation

Our implementation follows the full OAuth 2.0 + OIDC specification:

1. **Authorization Request** (`/verify`)

   - Generates PKCE code_verifier and code_challenge
   - Creates secure state parameter
   - Redirects to Fayda with proper scopes and claims

2. **Callback Handling** (`/callback`)

   - Validates state parameter for CSRF protection
   - Prevents duplicate processing with proper state management
   - Handles OAuth errors gracefully

3. **Token Exchange** (`/api/token`)

   - Exchanges authorization code for tokens
   - Uses client assertion (JWT) instead of client_secret
   - Validates PKCE code_verifier
   - Returns access_token and id_token

4. **UserInfo Retrieval** (`/api/userinfo`)

   - Uses access_token to fetch user data
   - Implements multiple request strategies (POST/GET)
   - Handles both JSON and JWT response formats
   - Processes multi-language user data

5. **User Dashboard** (`/verified`)
   - Displays verified user information
   - Provides verification proof download
   - Shows verification status and timestamp

## 📱 User Journey

1. **Landing Page** (`/`) - Marketing page with call-to-action
2. **Verification Start** (`/verify`) - KYC process explanation and initiation
3. **Fayda eSignet** - External authentication (redirected)
4. **OAuth Callback** (`/callback`) - Processing and token exchange
5. **Verified Dashboard** (`/verified`) - Success page with user data
6. **Admin Dashboard** (`/admin`) - Management interface (optional)

## 🔐 Security Features

- **OAuth 2.0 + OIDC**: Industry standard authentication
- **PKCE**: Prevents authorization code interception
- **Client Assertion**: JWT-based client authentication
- **State Validation**: CSRF protection
- **Secure Storage**: Tokens stored in sessionStorage (not localStorage)
- **No Data Persistence**: User data not stored server-side by default

## 🎨 Design System

- **Primary Colors**: `#E43F6F` (pink) and `#24050E` (dark)
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Components**: Shadcn/ui with custom FaydaPass theming
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first with proper breakpoints

## 📊 What's Working

✅ **Full OAuth Flow**: Authorization → Callback → Token Exchange → UserInfo
✅ **Error Handling**: Comprehensive error states and user feedback
✅ **Security**: PKCE, client assertions, state validation
✅ **UI/UX**: Modern, responsive design with smooth animations
✅ **User Data**: Successfully fetching and displaying Fayda user information
✅ **Admin Interface**: User management and analytics dashboard

## 🚧 Future Enhancements

- **Database Integration**: Store verification logs and user consent
- **PDF Certificates**: Generate downloadable verification certificates
- **Multi-language UI**: Full Amharic localization
- **API Rate Limiting**: Implement request throttling
- **Audit Logging**: Comprehensive verification audit trails
- **Webhook Support**: Real-time verification notifications

## 📋 Environment Variables Reference

| Variable                             | Description                | Status     | Required |
| ------------------------------------ | -------------------------- | ---------- | -------- |
| `NEXT_PUBLIC_CLIENT_ID`              | Fayda eSignet client ID    | ✅ Working | Yes      |
| `NEXT_PUBLIC_REDIRECT_URI`           | OAuth callback URL         | ✅ Working | Yes      |
| `NEXT_PUBLIC_AUTHORIZATION_ENDPOINT` | Fayda auth endpoint        | ✅ Working | Yes      |
| `NEXT_PUBLIC_TOKEN_ENDPOINT`         | Fayda token endpoint       | ✅ Working | Yes      |
| `NEXT_PUBLIC_USERINFO_ENDPOINT`      | Fayda userinfo endpoint    | ✅ Working | Yes      |
| `TOKEN_ENDPOINT`                     | Server-side token endpoint | ✅ Working | Yes      |
| `CLIENT_ASSERTION_TYPE`              | JWT assertion type         | ✅ Working | Yes      |
| `PRIVATE_KEY`                        | Base64 JWK private key     | ✅ Working | Yes      |

## 🐛 Known Issues & Solutions

### ✅ Solved Issues

1. **UserInfo 401 Error**: Fixed by implementing POST request with form data
2. **Token Reuse Error**: Fixed with proper state management in callback
3. **Duplicate Requests**: Prevented with `isProcessing` flag
4. **JWT Signing**: Successfully implemented RS256 client assertion

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👥 Team

👤 **Mohamed Ibrahim** - Lead Developer

- GitHub: [@CakeInTech](https://github.com/CakeInTech)
- LinkedIn: [Mohamed Ibrahim](https://www.linkedin.com/in/cakeintech/)

👤 **Fetiya Yusuf** - Developer

- GitHub: [@fafiyusuf](https://github.com/fafiyusuf)

👤 **Keyreh Husen** - Developer

- GitHub: [@keyreh](https://github.com/keyreh)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Fayda eSignet Issues**: Contact Fayda technical support
- **Application Issues**: Create an issue in this repository
- **Integration Help**: Check the documentation or reach out to the team

---

**Status**: ✅ **FULLY FUNCTIONAL** - Complete OAuth 2.0 + OIDC integration with Fayda eSignet working end-to-end!
