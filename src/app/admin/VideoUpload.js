// app/admin/VideoUpload.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";

export default function VideoUpload() {
  const [videos, setVideos] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const { getToken } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keywords: "",
    relatedPeople: [],
    datetime: "",
    videoFile: null,
  });

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      if (data.status === "success") {
        setVideos(data.data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchVideos();
    fetchProfiles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append(
        "keywords",
        JSON.stringify(formData.keywords.split(",").map((k) => k.trim()))
      );
      formDataToSend.append(
        "relatedPeople",
        JSON.stringify(formData.relatedPeople)
      );
      formDataToSend.append("datetime", formData.datetime);

      if (formData.videoFile) {
        formDataToSend.append("video", formData.videoFile);
      }

      const endpoint = editingVideo
        ? `${process.env.NEXT_PUBLIC_API_URL}/videos/${editingVideo._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/videos`;

      const method = editingVideo ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        fetchVideos();
        setShowForm(false);
        setEditingVideo(null);
        setFormData({
          title: "",
          description: "",
          keywords: "",
          relatedPeople: [],
          datetime: "",
          videoFile: null,
        });
      }
    } catch (error) {
      console.error("Error saving video:", error);
    }
  };

  const handleDelete = async (videoId) => {
    if (confirm("Are you sure you want to delete this video?")) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/videos/${videoId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (response.ok) {
          fetchVideos();
        }
      } catch (error) {
        console.error("Error deleting video:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Video Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upload New Video
        </button>
      )}

      {/* Video Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border rounded-md"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) =>
                setFormData({ ...formData, keywords: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Related People
            </label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {profiles.map((profile) => (
                <label
                  key={profile._id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={formData.relatedPeople.some(
                      (p) => p.person === profile._id
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          relatedPeople: [
                            ...formData.relatedPeople,
                            {
                              person: profile._id,
                              name: profile.name,
                            },
                          ],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          relatedPeople: formData.relatedPeople.filter(
                            (p) => p.person !== profile._id
                          ),
                        });
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">{profile.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date and Time
            </label>
            <input
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) =>
                setFormData({ ...formData, datetime: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Video File
            </label>
            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, videoFile: e.target.files[0] })
              }
              accept="video/*"
              className="mt-1 w-full"
              required={!editingVideo}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingVideo ? "Update Video" : "Upload Video"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingVideo(null);
                setFormData({
                  title: "",
                  description: "",
                  keywords: "",
                  relatedPeople: [],
                  datetime: "",
                  videoFile: null,
                });
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Videos List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          videos.map((video) => (
            <div key={video._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{video.title}</h3>
                  <p className="text-sm text-gray-600">{video.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {video.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-sm rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    Related People:{" "}
                    {video.relatedPeople.map((p) => p.name).join(", ")}
                  </div>
                  <div className="text-sm text-gray-500">
                    Date: {new Date(video.datetime).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
