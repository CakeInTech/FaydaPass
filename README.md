# FaydaPass - Secure KYC Onboarding

A modern, responsive KYC onboarding web application built with Next.js, integrating with Fayda's eSignet OIDC system for secure Ethiopian identity verification.

## 🌟 Features

- **Seamless OIDC Integration**: OAuth 2.0 flow with Fayda eSignet
- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Secure Authentication**: Bank-grade security protocols
- **Instant Verification**: Complete KYC in under 60 seconds
- **Mobile-First**: Optimized for all device sizes
- **Error Handling**: Comprehensive error states and validation

## 🚀 Tech Stack

- **Next.js 14**
- **TypeScript**
- **TailwindCSS**
- **Shadcn/ui Components**
- **Lucide React Icons**

## 🛠 Setup Instructions

### 1. Environment Configuration

The application is configured with actual Fayda eSignet OIDC endpoints:

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
```

### 2. Fayda eSignet Integration

The application implements the complete Fayda eSignet OIDC flow according to official specifications:

**Key Features:**

- **PKCE Implementation**: Uses code_verifier and code_challenge for enhanced security
- **Client Assertion**: JWT-based client authentication instead of client_secret
- **Claims Management**: Configurable KYC data requests with essential/optional fields
- **Multi-language Support**: Handles English and Amharic language preferences
- **JWT Decoding**: Properly decodes JWT responses from userinfo endpoint
- **Error Handling**: Comprehensive error handling for Fayda-specific error codes

**OIDC Flow:**

1. Authorization request with PKCE parameters and claims
2. Callback handling with state validation
3. Token exchange using client assertion and code verifier
4. UserInfo retrieval and JWT decoding
5. Multi-language field processing

**Note**: The current implementation uses a mock client assertion for demonstration. In production, you'll need to implement proper JWT signing with your private key.

### Week 1 (Hackathon Week)

- [x] Setup `Next.js` project with App Router
- [x] Integrate Fayda OIDC login (via redirect)
- [x] Display fetched user data after verification
- [x] Store data with consent flag
- [x] Create a comprehensive admin dashboard
- [x] Setup database schema for KYC entries

### Additional Features Implemented

- [x] Comprehensive admin dashboard with analytics
- [x] User detail pages with consent tracking
- [x] Data export functionality (JSON/CSV)
- [x] Advanced filtering and search
- [x] Real-time statistics and metrics
- [x] Consent logging and audit trails
- [x] Responsive design for all screen sizes

### 3. Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📱 User Flow

1. **Landing Page** (`/`) - Hero section with call-to-action
2. **Documentation** (`/docs`) - Developer integration guide
3. **Verification Start** (`/verify`) - KYC process explanation
4. **OAuth Callback** (`/callback`) - Handles Fayda redirect
5. **Verified Dashboard** (`/verified`) - Shows verification status
6. **Admin Dashboard** (`/admin`) - User management and analytics

## 🔐 Security Features

- OAuth 2.0 with PKCE (state parameter validation)
- Secure token storage (sessionStorage)
- CSRF protection
- Encrypted data transmission
- No sensitive data persistence

## 🎨 Design System

- **Colors**: E43F6F and 24050E theme
- **Typography**: Inter font family
- **Spacing**: 8px grid system
- **Components**: Shadcn/ui with custom styling
- **Responsive**: Mobile-first approach

## 📝 API Routes

- `POST /api/auth/token` - Exchange authorization code for tokens
- `GET /api/auth/userinfo` - Fetch user information

## 📚 Developer Documentation

Visit `/docs` for comprehensive integration guides including:

- Quick start guide with code examples
- SDK documentation for React, Node.js, and vanilla JavaScript
- Complete API reference
- Authentication flow explanations
- Sample implementations and best practices

## 🚀 Deployment

The application is configured for static export and can be deployed to:

- Vercel
- Netlify
- Any static hosting provider

```bash
npm run build
```

## 🔧 Customization

### Adding New Features

1. **Database Integration**: Add Supabase for verification logging
2. **PDF Generation**: Implement verification certificate export
3. **Admin Dashboard**: Create management interface
4. **Multi-language**: Add Amharic localization

### Styling

- Modify `tailwind.config.ts` for theme changes
- Update `app/globals.css` for custom animations
- Customize component styles in `/components/ui/`

## 📋 Environment Variables

| Variable                             | Description                  | Required |
| ------------------------------------ | ---------------------------- | -------- |
| `NEXT_PUBLIC_CLIENT_ID`              | Fayda eSignet client ID      | Yes      |
| `NEXT_PUBLIC_REDIRECT_URI`           | OAuth redirect URI           | Yes      |
| `NEXT_PUBLIC_AUTHORIZATION_ENDPOINT` | Fayda authorization endpoint | Yes      |
| `NEXT_PUBLIC_TOKEN_ENDPOINT`         | Fayda token endpoint         | Yes      |
| `NEXT_PUBLIC_USERINFO_ENDPOINT`      | Fayda userinfo endpoint      | Yes      |
| `NEXT_PUBLIC_ALGORITHM`              | JWT signing algorithm        | Yes      |
| `NEXT_PUBLIC_CLIENT_ASSERTION_TYPE`  | OAuth client assertion type  | Yes      |
| `NEXT_PUBLIC_BASE_URL`               | Application base URL         | Yes      |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 👥 Authors <a name="authors"></a>

<br>

👤 **Mohamed Ibrahim**

- GitHub: [Mohamed Ibrahim](https://github.com/CakeInTech)
- LinkedIn: [Mohamed Ibrahim](https://www.linkedin.com/in/cakeintech/)

👤 **Fetiya Yusuf**

- GitHub: [Fetiya Yusuf](https://github.com/fafiyusuf)

👤 **Keyreh Husen**

- GitHub: [Keyreh Husen](https://github.com/keyreh)

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support with Fayda eSignet integration, contact the Fayda technical team.
For application issues, create an issue in this repository.
