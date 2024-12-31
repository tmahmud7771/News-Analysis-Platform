"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import ProfileList from "./ProfileList";
import VideoUpload from "./VideoUpload";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("profiles"); // profiles or videos
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(true);
      return;
    }

    if (user.role !== "admin") {
      router.push("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Admin: {user?.username}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setActiveTab("profiles")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "profiles"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Manage Profiles
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "videos"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Manage Videos
            </button>
          </div>
        </div>
      </nav>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "profiles" ? <ProfileList /> : <VideoUpload />}
      </div>
    </div>
  );
}
