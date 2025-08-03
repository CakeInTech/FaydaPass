import { getAllVerifications } from "@/lib/supabase";

// Make the component async to fetch data on the server
export default async function Page() {
  // Fetch real data from Supabase instead of using mock data
  const verifications = await getAllVerifications();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Verifications</h1>
      </div>
      {/* Display verifications data */}
      <div className="mt-4">
        <p>Total verifications: {verifications.length}</p>
        {/* Add your verifications table component here */}
      </div>
    </div>
  );
}
