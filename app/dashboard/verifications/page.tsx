import { getAllVerifications } from "@/lib/supabase";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import SignOutButton from "@/components/SignOutButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Make the component async to fetch data on the server
export default async function Page() {
  // Fetch real data from Supabase instead of using mock data
  const verifications = await getAllVerifications();

  return (
    <BackgroundWrapper>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Verifications</h1>
                <p className="text-white/70">View all verification records</p>
              </div>
            </div>
            <SignOutButton />
          </div>

          {/* Content */}
          <div className="bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Total Verifications: {verifications.length}
              </h2>
            </div>

            {/* Verifications Table */}
            <div className="space-y-4">
              {verifications.length > 0 ? (
                verifications.map((verification, index) => (
                  <div
                    key={verification.id || index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div>
                      <h3 className="text-white font-medium">
                        {verification.user_email || `Verification ${index + 1}`}
                      </h3>
                      <p className="text-white/70 text-sm">
                        Status: {verification.status || "Unknown"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-sm">
                        {verification.created_at
                          ? new Date(
                              verification.created_at
                            ).toLocaleDateString()
                          : "No date"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/70">
                  No verifications found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
