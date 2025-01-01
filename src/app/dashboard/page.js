"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import VideoList from "@/app/dashboard/VideoList";
import SearchAnalytics from "@/components/SearchAnalytics";

export default function DashboardPage() {
  const { user, logout, getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Profile selection states
  const [profiles, setProfiles] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [profileSearchQuery, setProfileSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Fetch profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/persons`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const data = await res.json();
        if (data.status === "success") {
          setProfiles(data.data);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  // Filter profiles based on search query
  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(profileSearchQuery.toLowerCase())
  );

  const handleAddKeyword = (e) => {
    if (e.key === "Enter" && currentKeyword && keywords.length < 10) {
      setKeywords([...keywords, currentKeyword]);
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (keyword) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleSearch = () => {
    setShowFilters(true);
    setShowAnalytics(true); // Show analytics when search is performed
  };

  const handleProfileSelect = (profile) => {
    if (!selectedProfiles.find((p) => p._id === profile._id)) {
      setSelectedProfiles([...selectedProfiles, profile]);
    }
    setProfileSearchQuery("");
    setShowProfileDropdown(false);
  };

  const removeProfile = (profileId) => {
    setSelectedProfiles(selectedProfiles.filter((p) => p._id !== profileId));
  };

  // Handle search results update
  const handleSearchResults = (results) => {
    setSearchResults(results);
    setShowAnalytics(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Video Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.username}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          {/* Search Box */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>

          {/* Keywords Input */}
          <div>
            <input
              type="text"
              placeholder="Add keywords (max 10) - Press Enter to add"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyDown={handleAddKeyword}
              disabled={keywords.length >= 10}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded"
                  >
                    {keyword}
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Profile Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related People
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search and select profiles..."
                value={profileSearchQuery}
                onChange={(e) => {
                  setProfileSearchQuery(e.target.value);
                  setShowProfileDropdown(true);
                }}
                onFocus={() => setShowProfileDropdown(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showProfileDropdown && filteredProfiles.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                  {filteredProfiles.map((profile) => (
                    <div
                      key={profile._id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleProfileSelect(profile)}
                    >
                      {profile.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedProfiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedProfiles.map((profile) => (
                  <span
                    key={profile._id}
                    className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded"
                  >
                    {profile.name}
                    <button
                      onClick={() => removeProfile(profile._id)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Date Range Selection */}
          <div className="flex gap-4">
            <input
              type="date"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Analytics Section */}
        {showAnalytics && searchResults && (
          <div className="mt-6 transition-all duration-300 ease-in-out">
            <SearchAnalytics
              searchResults={searchResults}
              searchQuery={searchQuery}
              selectedProfiles={selectedProfiles}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        )}
      </div>

      {/* Video List Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <VideoList
          searchQuery={searchQuery}
          keywords={keywords}
          startDate={startDate}
          endDate={endDate}
          selectedProfiles={selectedProfiles}
          onResultsUpdate={handleSearchResults} // Add this line
        />
      </div>
    </div>
  );
}
