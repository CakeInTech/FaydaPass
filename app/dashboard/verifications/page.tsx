import VerificationsTable from "@/app/ui/dashboard/verifications-table"; // Assuming this is the path to your table component
import { lusitana } from "@/app/ui/fonts";
import { getVerifications } from "@/lib/supabase";

// Make the component async to fetch data on the server
export default async function Page() {
  // Fetch real data from Supabase instead of using mock data
  const verifications = await getVerifications();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Verifications</h1>
      </div>
      {/* Pass the real data to the table component */}
      <VerificationsTable verifications={verifications} />
    </div>
  );
}
