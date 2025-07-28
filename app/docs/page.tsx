"use client";

import DocsBackgroundWrapper from "@/components/docs/DocsBackgroundWrapper";
import Footer from "@/components/docs/DocsFooter";
import { DocsLayout } from "@/components/docs/DocsLayout";
import DocsNavbar from "@/components/docs/DocsNavbar"; // Using DocsNavbar
import { DocsPageHeader } from "@/components/docs/DocsPageHeader";
import { MdxComponents } from "@/components/docs/MdxComponents";

export default function DocsPage() {
  return (
    <DocsBackgroundWrapper>
      <DocsNavbar /> {/* Fixed navbar at the top */}
      <DocsLayout> {/* Contains the fixed sidebar and scrollable main content */}
        <DocsPageHeader
          heading="Introduction"
          text="FaydaPass is a complete open-source authentication solution for Next.js applications."
        />

        {/* MDX Content - styled via MdxComponents */}
        <MdxComponents.h2 id="about-faydapass">About FaydaPass</MdxComponents.h2>
        <MdxComponents.p>
          FaydaPass is a complete open-source authentication solution for Next.js
          applications. It is designed from the ground up to support Next.js and
          Serverless.
        </MdxComponents.p>
        <MdxComponents.p>
          Check out the{" "}
          <a href="/code-examples">example code</a> to see how easy
          it is to use FaydaPass for authentication.
        </MdxComponents.p>

        <MdxComponents.h2 id="flexible-and-easy-to-use">
          Flexible and easy to use
        </MdxComponents.h2>
        <MdxComponents.ul>
          <MdxComponents.li>
            Designed to work with any OAuth service, it supports OAuth 1.0, 1.0A,
            2.0 and OpenID Connect
          </MdxComponents.li>
          <MdxComponents.li>
            Built-in support for many popular sign-in services
          </MdxComponents.li>
          <MdxComponents.li>
            Supports email / passwordless authentication
          </MdxComponents.li>
          <MdxComponents.li>
            Supports stateless authentication with any backend (Active Directory,
            LDAP, etc)
          </MdxComponents.li>
        </MdxComponents.ul>

        <MdxComponents.h2 id="own-your-own-data">
          Own your own data
        </MdxComponents.h2>
        <MdxComponents.p>
          FaydaPass can be used with or without a database.
        </MdxComponents.p>

        <MdxComponents.h2 id="secure-by-default">
          Secure by default
        </MdxComponents.h2>
        <MdxComponents.p>
          Security is paramount. FaydaPass is built with robust security features, including:
        </MdxComponents.p>
        <MdxComponents.ul>
          <MdxComponents.li>OAuth 2.0 with PKCE and state parameter validation.</MdxComponents.li>
          <MdxComponents.li>Secure token storage (e.g., using `sessionStorage`).</MdxComponents.li>
          <MdxComponents.li>CSRF (Cross-Site Request Forgery) protection.</MdxComponents.li>
          <MdxComponents.li>Encrypted data transmission.</MdxComponents.li>
          <MdxComponents.li>No sensitive data is persisted directly in the application.</MdxComponents.li>
        </MdxComponents.ul>

        <MdxComponents.h2 id="credits">Credits</MdxComponents.h2>
        <MdxComponents.p>
          FaydaPass is an open-source project. We extend our gratitude to the contributors:
        </MdxComponents.p>
        <MdxComponents.ul>
          <MdxComponents.li>
            <a href="#" target="_blank" rel="noopener noreferrer">Mohamed Ibrahim</a>
          </MdxComponents.li>
          <MdxComponents.li>
            <a href="#" target="_blank" rel="noopener noreferrer">Fetiya Yusuf</a>
          </MdxComponents.li>
        </MdxComponents.ul>

        <MdxComponents.h2 id="getting-started-next-steps">
          Getting Started
        </MdxComponents.h2>
        <MdxComponents.p>
          Ready to integrate FaydaPass into your application? Visit our{" "}
          <a href="/resources">Developer Resources</a> page for quick start guides, API references, and more.
        </MdxComponents.p>
      </DocsLayout>
      <Footer /> {/* Footer outside DocsLayout to span full width */}
    </DocsBackgroundWrapper>
  );
}
