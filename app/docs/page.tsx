"use client"

import DocsBackgroundWrapper from "@/components/docs/DocsBackgroundWrapper"
import Footer from "@/components/docs/DocsFooter"
import { DocsLayout } from "@/components/docs/DocsLayout"
import DocsNavbar from "@/components/docs/DocsNavbar"
import { DocsPageHeader } from "@/components/docs/DocsPageHeader"
import { DocsSidebar } from "@/components/docs/DocsSidebar"
import { MdxComponents } from "@/components/docs/MdxComponents"

const headings = [
  { id: "about-faydapass", title: "About FaydaPass" },
  { id: "flexible-and-easy-to-use", title: "Flexible & Easy to Use" },
  { id: "own-your_own-data", title: "Own Your Own Data" },
  { id: "secure-by-default", title: "Secure by Default" },
  { id: "credits", title: "Credits" },
  { id: "getting-started-next-steps", title: "Getting Started" },
]

export default function Page() {
  return (
    <DocsBackgroundWrapper>
      <DocsNavbar />
      <DocsSidebar headings={headings} />
      <DocsLayout>
        <DocsPageHeader
          heading="Introduction"
          text="FaydaPass is a complete open-source authentication solution for Next.js applications."
        />

        {/* MDX Content */}
        <section id="about-faydapass">
          <MdxComponents.h2>About FaydaPass</MdxComponents.h2>
          <MdxComponents.p>
            FaydaPass is a complete open-source authentication solution for{" "}
            <MdxComponents.a href="https://nextjs.org">Next.js</MdxComponents.a> applications.
          </MdxComponents.p>
          <MdxComponents.p>It is designed from the ground up to support Next.js and Serverless.</MdxComponents.p>
          <MdxComponents.p>
            Check out the <MdxComponents.a href="/code-examples">example code</MdxComponents.a> to see how easy it is to
            use FaydaPass for authentication.
          </MdxComponents.p>
        </section>

        <section id="flexible-and-easy-to-use">
          <MdxComponents.h2>Flexible and easy to use</MdxComponents.h2>
          <MdxComponents.ul>
            <MdxComponents.li>
              Designed to work with any <MdxComponents.a href="#">OAuth service</MdxComponents.a>, it supports{" "}
              <MdxComponents.a href="#">OAuth 1.0</MdxComponents.a>, <MdxComponents.a href="#">1.0A</MdxComponents.a>,{" "}
              <MdxComponents.a href="#">2.0</MdxComponents.a> and{" "}
              <MdxComponents.a href="#">OpenID Connect</MdxComponents.a>
            </MdxComponents.li>
            <MdxComponents.li>
              Built-in support for <MdxComponents.a href="#">many popular sign-in services</MdxComponents.a>
            </MdxComponents.li>
            <MdxComponents.li>
              Supports <MdxComponents.a href="#">email</MdxComponents.a> /{" "}
              <MdxComponents.a href="#">passwordless authentication</MdxComponents.a>
            </MdxComponents.li>
            <MdxComponents.li>
              Supports stateless authentication with <MdxComponents.a href="#">any backend</MdxComponents.a> (Active
              Directory, LDAP, etc)
            </MdxComponents.li>
            <MdxComponents.li>Supports both JSON Web Tokens and database sessions</MdxComponents.li>
            <MdxComponents.li>
              Designed for Serverless but runs anywhere (AWS Lambda, Docker, Heroku, etc...)
            </MdxComponents.li>
          </MdxComponents.ul>
        </section>

        <section id="own-your-own-data">
          <MdxComponents.h2>Own your own data</MdxComponents.h2>
          <MdxComponents.p>FaydaPass can be used with or without a database.</MdxComponents.p>
        </section>

        <section id="secure-by-default">
          <MdxComponents.h2>Secure by default</MdxComponents.h2>
          <MdxComponents.p>
            Security is paramount. FaydaPass is built with robust security features, including:
          </MdxComponents.p>
        </section>

        <section id="credits">
          <MdxComponents.h2>Credits</MdxComponents.h2>
          <MdxComponents.p>
            FaydaPass is an open-source project. We extend our gratitude to the contributors.
          </MdxComponents.p>
        </section>

        <section id="getting-started-next-steps">
          <MdxComponents.h2>Getting Started</MdxComponents.h2>
          <MdxComponents.p>
            Ready to integrate FaydaPass into your application? Visit our{" "}
            <MdxComponents.a href="/resources">Developer Resources</MdxComponents.a> page for quick start guides, API
            references, and more.
          </MdxComponents.p>
        </section>
      </DocsLayout>
      <Footer />
    </DocsBackgroundWrapper>
  )
}
