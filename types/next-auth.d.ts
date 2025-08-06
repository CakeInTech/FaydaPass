import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      plan_type: string
      company_name?: string
      api_key?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    plan_type: string
    company_name?: string
    api_key?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    plan_type: string
    company_name?: string
    api_key?: string
  }
}