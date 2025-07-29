"use client";

import DocsBackgroundWrapper from "@/components/docs/DocsBackgroundWrapper";
import Footer from "@/components/docs/DocsFooter";
import { DocsLayout } from "@/components/docs/DocsLayout";
import DocsNavbar from "@/components/docs/DocsNavbar";
import { DocsPageHeader } from "@/components/docs/DocsPageHeader";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { MdxComponents } from "@/components/docs/MdxComponents";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Shield,
  Zap,
  Globe,
  Code,
  Lock,
  Users,
  ArrowRight,
} from "lucide-react";

const headings = [
  { id: "about-faydapass", title: "About FaydaPass" },
  { id: "key-features", title: "Key Features" },
  { id: "quick-start", title: "Quick Start" },
  { id: "installation", title: "Installation" },
  { id: "configuration", title: "Configuration" },
  { id: "authentication-flow", title: "Authentication Flow" },
  { id: "api-reference", title: "API Reference" },
  { id: "security", title: "Security" },
  { id: "examples", title: "Examples" },
  { id: "deployment", title: "Deployment" },
  { id: "troubleshooting", title: "Troubleshooting" },
  { id: "contributing", title: "Contributing" },
];

export default function Page() {
  return (
    <DocsBackgroundWrapper>
      <DocsNavbar />
      <DocsSidebar headings={headings} />
      <DocsLayout>
        <DocsPageHeader
          heading="FaydaPass Documentation"
          text="The developer-first KYC platform for Ethiopia. Integrate secure identity verification in minutes with our modern OAuth 2.0 + OIDC solution."
        />

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Production Ready
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Shield className="w-3 h-3 mr-1" />
            SOC 2 Compliant
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Zap className="w-3 h-3 mr-1" />
            99.9% Uptime
          </Badge>
        </div>

        {/* About FaydaPass */}
        <section id="about-faydapass" className="mb-12">
          <MdxComponents.h2>About FaydaPass</MdxComponents.h2>
          <MdxComponents.p>
            FaydaPass is a complete open-source KYC (Know Your Customer)
            verification platform specifically designed for Ethiopian
            businesses. Built on top of the Fayda eSignet infrastructure, it
            provides seamless integration with Ethiopia's national identity
            system.
          </MdxComponents.p>
          <MdxComponents.p>
            Our platform is designed from the ground up to support modern web
            applications with{" "}
            <MdxComponents.a href="https://nextjs.org">Next.js</MdxComponents.a>
            , serverless architectures, and follows OAuth 2.0 + OpenID Connect
            standards for maximum security and compatibility.
          </MdxComponents.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <Globe className="w-8 h-8 text-blue-400 mb-2" />
              <h4 className="text-white font-semibold mb-1">
                Government Backed
              </h4>
              <p className="text-gray-400 text-sm">
                Powered by Ethiopia's official Fayda eSignet system
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <Code className="w-8 h-8 text-green-400 mb-2" />
              <h4 className="text-white font-semibold mb-1">Developer First</h4>
              <p className="text-gray-400 text-sm">
                Simple APIs, comprehensive docs, ready-to-use examples
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <Lock className="w-8 h-8 text-purple-400 mb-2" />
              <h4 className="text-white font-semibold mb-1">
                Bank-Grade Security
              </h4>
              <p className="text-gray-400 text-sm">
                OAuth 2.0, PKCE, JWT, and end-to-end encryption
              </p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section id="key-features" className="mb-12">
          <MdxComponents.h2>Key Features</MdxComponents.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">
                    Real-time Verification
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Complete KYC verification in under 60 seconds
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">OAuth 2.0 + OIDC</h4>
                  <p className="text-gray-400 text-sm">
                    Industry standard authentication protocols
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">PKCE Security</h4>
                  <p className="text-gray-400 text-sm">
                    Proof Key for Code Exchange for enhanced security
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">
                    Multi-language Support
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Handles both English and Amharic user data
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">
                    Mobile-First Design
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Fully responsive across all device sizes
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">TypeScript Support</h4>
                  <p className="text-gray-400 text-sm">
                    Full type safety with generated types
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section id="quick-start" className="mb-12">
          <MdxComponents.h2>Quick Start</MdxComponents.h2>
          <MdxComponents.p>
            Get up and running with FaydaPass in less than 5 minutes. This guide
            will walk you through the basic setup.
          </MdxComponents.p>

          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 my-6">
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              Test Credentials
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">FIN:</span>
                <code className="text-green-400 bg-gray-800 px-2 py-1 rounded">
                  6140798523917519
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">OTP:</span>
                <code className="text-green-400 bg-gray-800 px-2 py-1 rounded">
                  111111
                </code>
              </div>
            </div>
          </div>

          <CodeBlock
            language="bash"
            code={`# Clone the repository
git clone https://github.com/CakeInTech/faydapass.git
cd faydapass

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev`}
          />
        </section>

        {/* Installation */}
        <section id="installation" className="mb-12">
          <MdxComponents.h2>Installation</MdxComponents.h2>
          <MdxComponents.p>
            FaydaPass can be installed in multiple ways depending on your
            project setup.
          </MdxComponents.p>

          <MdxComponents.h3>Using npm</MdxComponents.h3>
          <CodeBlock
            language="bash"
            code="npm install @faydapass/core @faydapass/nextjs"
          />

          <MdxComponents.h3>Using yarn</MdxComponents.h3>
          <CodeBlock
            language="bash"
            code="yarn add @faydapass/core @faydapass/nextjs"
          />

          <MdxComponents.h3>Using the Template</MdxComponents.h3>
          <CodeBlock
            language="bash"
            code="npx create-faydapass-app my-kyc-app"
          />
        </section>

        {/* Configuration */}
        <section id="configuration" className="mb-12">
          <MdxComponents.h2>Configuration</MdxComponents.h2>
          <MdxComponents.p>
            Configure your environment variables to connect with the Fayda
            eSignet system.
          </MdxComponents.p>

          <CodeBlock
            language="bash"
            filename=".env.local"
            code={`# Fayda eSignet OIDC Configuration
NEXT_PUBLIC_CLIENT_ID=your_client_id
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_AUTHORIZATION_ENDPOINT=https://esignet.ida.fayda.et/authorize
NEXT_PUBLIC_TOKEN_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token
NEXT_PUBLIC_USERINFO_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oidc/userinfo

# JWT Signing (Required for client assertion)
PRIVATE_KEY=your_base64_encoded_jwk_private_key

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000`}
          />

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 my-6">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-black text-xs font-bold">!</span>
              </div>
              <div>
                <h4 className="text-yellow-400 font-medium mb-1">Important</h4>
                <p className="text-yellow-200 text-sm">
                  Never commit your private keys or sensitive credentials to
                  version control. Use environment variables and keep your{" "}
                  <code>.env.local</code> file in your <code>.gitignore</code>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Authentication Flow */}
        <section id="authentication-flow" className="mb-12">
          <MdxComponents.h2>Authentication Flow</MdxComponents.h2>
          <MdxComponents.p>
            FaydaPass implements the complete OAuth 2.0 + OIDC flow with PKCE
            for maximum security.
          </MdxComponents.p>

          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 my-6">
            <h4 className="text-white font-semibold mb-4">Flow Overview</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <div>
                  <h5 className="text-white font-medium">
                    Authorization Request
                  </h5>
                  <p className="text-gray-400 text-sm">
                    Generate PKCE parameters and redirect to Fayda
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <div>
                  <h5 className="text-white font-medium">
                    User Authentication
                  </h5>
                  <p className="text-gray-400 text-sm">
                    User authenticates with Fayda eSignet
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <div>
                  <h5 className="text-white font-medium">
                    Callback Processing
                  </h5>
                  <p className="text-gray-400 text-sm">
                    Handle OAuth callback and validate state
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  4
                </div>
                <div>
                  <h5 className="text-white font-medium">Token Exchange</h5>
                  <p className="text-gray-400 text-sm">
                    Exchange authorization code for access token
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  5
                </div>
                <div>
                  <h5 className="text-white font-medium">
                    User Info Retrieval
                  </h5>
                  <p className="text-gray-400 text-sm">
                    Fetch verified user data from Fayda
                  </p>
                </div>
              </div>
            </div>
          </div>

          <CodeBlock
            language="typescript"
            filename="pages/api/auth/verify.ts"
            code={`import { generateCodeVerifier, generateCodeChallenge } from '@faydapass/core'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Generate PKCE parameters
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = generateCodeVerifier()

  // Store PKCE parameters
  req.session.codeVerifier = codeVerifier
  req.session.state = state

  // Build authorization URL
  const authUrl = new URL(process.env.NEXT_PUBLIC_AUTHORIZATION_ENDPOINT!)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_CLIENT_ID!)
  authUrl.searchParams.set('redirect_uri', process.env.NEXT_PUBLIC_REDIRECT_URI!)
  authUrl.searchParams.set('scope', 'openid profile email phone address')
  authUrl.searchParams.set('code_challenge', codeChallenge)
  authUrl.searchParams.set('code_challenge_method', 'S256')
  authUrl.searchParams.set('state', state)

  res.redirect(authUrl.toString())
}`}
          />
        </section>

        {/* API Reference */}
        <section id="api-reference" className="mb-12">
          <MdxComponents.h2>API Reference</MdxComponents.h2>
          <MdxComponents.p>
            Complete reference for all FaydaPass API endpoints and methods.
          </MdxComponents.p>

          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">POST /api/token</h4>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Required
                </Badge>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Exchange authorization code for access token
              </p>

              <h5 className="text-white font-medium mb-2">Request Body</h5>
              <CodeBlock
                language="json"
                code={`{
  "code": "authorization_code_from_callback",
  "code_verifier": "pkce_code_verifier",
  "client_id": "your_client_id",
  "redirect_uri": "your_redirect_uri"
}`}
              />

              <h5 className="text-white font-medium mb-2 mt-4">Response</h5>
              <CodeBlock
                language="json"
                code={`{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "id_token": "eyJhbGciOiJSUzI1NiIs..."
}`}
              />
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">GET /api/userinfo</h4>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Protected
                </Badge>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Retrieve verified user information
              </p>

              <h5 className="text-white font-medium mb-2">Headers</h5>
              <CodeBlock
                language="http"
                code="Authorization: Bearer {access_token}"
              />

              <h5 className="text-white font-medium mb-2 mt-4">Response</h5>
              <CodeBlock
                language="json"
                code={`{
  "sub": "user_unique_identifier",
  "name": "John Doe",
  "email": "john@example.com",
  "phone_number": "+251911234567",
  "email_verified": true,
  "phone_number_verified": true,
  "name_en": "John Doe",
  "name_am": "ጆን ዶ",
  "fayda_id": "unique_fayda_identifier"
}`}
              />
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="mb-12">
          <MdxComponents.h2>Security</MdxComponents.h2>
          <MdxComponents.p>
            FaydaPass implements multiple layers of security to protect user
            data and prevent unauthorized access.
          </MdxComponents.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <Shield className="w-8 h-8 text-blue-400 mb-3" />
              <h4 className="text-white font-semibold mb-2">
                OAuth 2.0 + OIDC
              </h4>
              <p className="text-gray-400 text-sm">
                Industry standard authentication and authorization protocols
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <Lock className="w-8 h-8 text-green-400 mb-3" />
              <h4 className="text-white font-semibold mb-2">
                PKCE Implementation
              </h4>
              <p className="text-gray-400 text-sm">
                Proof Key for Code Exchange prevents authorization code
                interception
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <Code className="w-8 h-8 text-purple-400 mb-3" />
              <h4 className="text-white font-semibold mb-2">
                JWT Client Assertion
              </h4>
              <p className="text-gray-400 text-sm">
                RS256 JWT signing for secure client authentication
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <Users className="w-8 h-8 text-orange-400 mb-3" />
              <h4 className="text-white font-semibold mb-2">
                State Validation
              </h4>
              <p className="text-gray-400 text-sm">
                CSRF protection with secure state parameter validation
              </p>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 my-6">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <h4 className="text-red-400 font-medium mb-1">
                  Security Best Practices
                </h4>
                <MdxComponents.ul>
                  <MdxComponents.li>
                    Never expose private keys or client secrets in client-side
                    code
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Always validate state parameters to prevent CSRF attacks
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Use HTTPS in production environments
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Implement proper session management and token storage
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Regularly rotate your JWT signing keys
                  </MdxComponents.li>
                </MdxComponents.ul>
              </div>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section id="examples" className="mb-12">
          <MdxComponents.h2>Examples</MdxComponents.h2>
          <MdxComponents.p>
            Ready-to-use examples for common integration scenarios.
          </MdxComponents.p>

          <div className="space-y-6">
            <div>
              <h4 className="text-white font-semibold mb-3">
                Basic Next.js Integration
              </h4>
              <CodeBlock
                language="typescript"
                filename="components/VerifyButton.tsx"
                code={`'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function VerifyButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = async () => {
    setIsLoading(true)
    try {
      // Redirect to verification endpoint
      window.location.href = '/api/auth/verify'
    } catch (error) {
      console.error('Verification failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleVerify}
      disabled={isLoading}
      className="bg-gradient-to-r from-blue-600 to-purple-600"
    >
      {isLoading ? 'Verifying...' : 'Verify with Fayda'}
    </Button>
  )
}`}
              />
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">
                React Hook for User Data
              </h4>
              <CodeBlock
                language="typescript"
                filename="hooks/useUser.ts"
                code={`import { useState, useEffect } from 'react'

interface User {
  sub: string
  name: string
  email?: string
  phone_number?: string
  verified: boolean
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem('access_token')
        if (!token) {
          setLoading(false)
          return
        }

        const response = await fetch('/api/userinfo', {
          headers: {
            'Authorization': \`Bearer \${token}\`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const userData = await response.json()
        setUser({ ...userData, verified: true })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, error }
}`}
              />
            </div>
          </div>
        </section>

        {/* Deployment */}
        <section id="deployment" className="mb-12">
          <MdxComponents.h2>Deployment</MdxComponents.h2>
          <MdxComponents.p>
            Deploy your FaydaPass application to various platforms with these
            configuration guides.
          </MdxComponents.p>

          <div className="space-y-6">
            <div>
              <h4 className="text-white font-semibold mb-3">
                Vercel Deployment
              </h4>
              <CodeBlock
                language="bash"
                code={`# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_CLIENT_ID
vercel env add PRIVATE_KEY
vercel env add NEXT_PUBLIC_REDIRECT_URI`}
              />
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">
                Docker Deployment
              </h4>
              <CodeBlock
                language="dockerfile"
                filename="Dockerfile"
                code={`FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]`}
              />
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section id="troubleshooting" className="mb-12">
          <MdxComponents.h2>Troubleshooting</MdxComponents.h2>
          <MdxComponents.p>
            Common issues and their solutions when integrating FaydaPass.
          </MdxComponents.p>

          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-2">
                UserInfo 401 Error
              </h4>
              <p className="text-gray-400 text-sm mb-3">
                This error occurs when the access token is invalid or the
                request format is incorrect.
              </p>
              <div className="bg-gray-800 rounded p-3 text-sm">
                <p className="text-green-400 mb-2">✅ Solution:</p>
                <MdxComponents.ul>
                  <MdxComponents.li>
                    Ensure you're using POST request with form data
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Verify the access token is valid and not expired
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Check that the Authorization header is properly formatted
                  </MdxComponents.li>
                </MdxComponents.ul>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-2">
                Token Exchange Failed
              </h4>
              <p className="text-gray-400 text-sm mb-3">
                Issues with exchanging authorization code for access token.
              </p>
              <div className="bg-gray-800 rounded p-3 text-sm">
                <p className="text-green-400 mb-2">✅ Solution:</p>
                <MdxComponents.ul>
                  <MdxComponents.li>
                    Verify your client assertion JWT is properly signed
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Check that the code_verifier matches the code_challenge
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Ensure the authorization code hasn't expired
                  </MdxComponents.li>
                </MdxComponents.ul>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-2">
                State Parameter Mismatch
              </h4>
              <p className="text-gray-400 text-sm mb-3">
                CSRF protection error when state parameters don't match.
              </p>
              <div className="bg-gray-800 rounded p-3 text-sm">
                <p className="text-green-400 mb-2">✅ Solution:</p>
                <MdxComponents.ul>
                  <MdxComponents.li>
                    Ensure state is properly stored in session/localStorage
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Check for race conditions in callback processing
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Verify state generation uses cryptographically secure random
                    values
                  </MdxComponents.li>
                </MdxComponents.ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contributing */}
        <section id="contributing" className="mb-12">
          <MdxComponents.h2>Contributing</MdxComponents.h2>
          <MdxComponents.p>
            We welcome contributions from the community! Here's how you can help
            improve FaydaPass.
          </MdxComponents.p>

          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6 my-6">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              Ways to Contribute
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">
                    Report bugs and issues
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">
                    Suggest new features
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">
                    Improve documentation
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">
                    Submit pull requests
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">Write tests</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">Share examples</span>
                </div>
              </div>
            </div>
          </div>

          <CodeBlock
            language="bash"
            code={`# Fork the repository and clone it
git clone https://github.com/yourusername/faydapass.git
cd faydapass

# Create a new branch for your feature
git checkout -b feature/amazing-feature

# Make your changes and commit them
git commit -m 'Add amazing feature'

# Push to your fork and submit a pull request
git push origin feature/amazing-feature`}
          />

          <div className="flex items-center justify-center mt-8">
            <a
              href="https://github.com/CakeInTech/faydapass"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              <Code className="w-5 h-5" />
              <span>View on GitHub</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </DocsLayout>
      <Footer />
    </DocsBackgroundWrapper>
  );
}
