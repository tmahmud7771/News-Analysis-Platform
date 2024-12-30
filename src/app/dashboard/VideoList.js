// app/dashboard/VideoList.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
const ITEMS_PER_PAGE = 10;

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function VideoList({
  searchQuery,
  keywords,
  startDate,
  endDate,
}) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const { getToken } = useAuth();

  const fetchVideos = async (page = 1) => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      if (searchQuery) searchParams.append("query", searchQuery);
      if (keywords?.length) searchParams.append("keywords", keywords.join(","));
      if (startDate) searchParams.append("startDate", startDate);
      if (endDate) searchParams.append("endDate", endDate);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/videos/search?${searchParams}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await res.json();
      if (data.status === "success") {
        setVideos(data.data);
        setTotalVideos(data.total);
        setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(currentPage);
  }, [currentPage, searchQuery, keywords, startDate, endDate]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Video List */}
      <div className="space-y-4">
        {videos.map((video) => (
          <div key={video._id} className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-4">
              {/* Video Preview - 35% width */}
              <div className="w-[35%]">
                <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
                  <video
                    src={video.videoLink}
                    className="absolute inset-0 w-full h-full object-cover"
                    controls
                  />
                </div>
              </div>

              {/* Video Details - 65% width */}
              <div className="w-[65%] space-y-2">
                {/* Title */}
                <h3 className="text-lg font-semibold hover:text-blue-600 cursor-pointer">
                  {video.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {video.description}
                </p>

                {/* Related People */}
                <div className="flex flex-wrap gap-2">
                  {video.relatedPeople.map((person, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded"
                    >
                      {person.person.name}
                    </span>
                  ))}
                </div>

                {/* Date */}
                <div className="text-sm text-gray-500">
                  {formatDate(video.datetime)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, totalVideos)} of{" "}
            {totalVideos} videos
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm rounded-md border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm rounded-md border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
