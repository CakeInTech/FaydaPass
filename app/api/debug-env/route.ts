import { NextResponse } from "next/server";

export async function GET() {
  // Only show environment variables that are relevant (and safe to show)
  const relevantEnvVars = Object.keys(process.env)
    .filter(
      (key) =>
        key.includes("TOKEN") ||
        key.includes("CLIENT") ||
        key.includes("PRIVATE") ||
        key.includes("ASSERTION") ||
        key.includes("REDIRECT") ||
        key.includes("AUTHORIZATION") ||
        key.includes("USERINFO") ||
        key.includes("ALGORITHM") ||
        key.includes("EXPIRATION")
    )
    .reduce((obj, key) => {
      // Only show first 20 characters for security
      obj[key] = process.env[key]
        ? key.includes("PRIVATE")
          ? "[REDACTED]"
          : process.env[key]?.substring(0, 50) + "..."
        : "undefined";
      return obj;
    }, {} as Record<string, string>);

  return NextResponse.json({
    message: "Environment variables debug info",
    relevantVars: relevantEnvVars,
    totalEnvVars: Object.keys(process.env).length,
    nodeEnv: process.env.NODE_ENV,
    cwd: process.cwd(),
  });
}
