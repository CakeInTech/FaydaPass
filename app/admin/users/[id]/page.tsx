import React from "react";

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // Generate static params for common user IDs
  // In a real app, you might fetch this from your database
  const userIds = ["1", "2", "3", "4", "5"];

  return userIds.map((id) => ({
    id: id,
  }));
}

interface PageProps {
  params: {
    id: string;
  };
}

const UserDetailPage = ({ params }: PageProps) => {
  const { id } = params;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">User Details</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">User ID: {id}</h2>
          <p className="text-gray-600">
            This is a placeholder page for user details. In a real application,
            this would display user information fetched based on the user ID.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
