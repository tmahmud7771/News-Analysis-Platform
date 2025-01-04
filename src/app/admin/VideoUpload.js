"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import VideoFormModal from "@/components/VideoFormModal";

export default function VideoUpload() {
  const [videos, setVideos] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [channels, setChannels] = useState([]);
  const { getToken } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keywords: "",
    relatedPeople: [],
    datetime: "",
    videoFile: null,
    channels: [],
  });

  // Fetch videos
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

  // Fetch profiles
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

  const fetchChannels = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/channels`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      if (data.status === "success") {
        setChannels(data.data);
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchProfiles();
    fetchChannels();
  }, []);

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title || "",
      description: video.description || "",
      keywords: Array.isArray(video.keywords) ? video.keywords.join(", ") : "",
      relatedPeople: Array.isArray(video.relatedPeople)
        ? video.relatedPeople
        : [],
      channels: Array.isArray(video.channels)
        ? video.channels.map((c) => ({ channel: c._id, name: c.name }))
        : [],
      datetime: video.datetime
        ? new Date(video.datetime).toISOString().slice(0, 16)
        : "",
      videoFile: null, // Reset video file on edit
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVideo(null);
    setFormData({
      title: "",
      description: "",
      keywords: "",
      relatedPeople: [],
      channels: [],
      datetime: "",
      videoFile: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Basic validation
      if (!formData.title?.trim()) throw new Error("Title is required");
      if (!formData.description?.trim())
        throw new Error("Description is required");
      if (!formData.datetime) throw new Error("Date and time is required");
      if (!editingVideo && !formData.videoFile)
        throw new Error("Video file is required");

      // Add base fields
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("datetime", formData.datetime);

      // Process and add keywords
      const processedKeywords = formData.keywords
        ? formData.keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k.length > 0)
        : [];
      formDataToSend.append("keywords", JSON.stringify(processedKeywords));

      // Process and add related people
      const processedPeople = Array.isArray(formData.relatedPeople)
        ? formData.relatedPeople
        : [];
      formDataToSend.append("relatedPeople", JSON.stringify(processedPeople));

      // Process and add channels

      const processedChannels = Array.isArray(formData.channels)
        ? formData.channels
        : [];
      formDataToSend.append("channels", JSON.stringify(processedChannels));

      // Add video file - IMPORTANT: must be appended last
      if (formData.videoFile) {
        formDataToSend.append("video", formData.videoFile);
        // console.log("Video file appended:", formData.videoFile.name);
      }

      // Debug logging
      console.log("Form submission data:");
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(key, `File: ${value.name}, size: ${value.size} bytes`);
        } else {
          console.log(key, value);
        }
      }

      const endpoint = editingVideo
        ? `${process.env.NEXT_PUBLIC_API_URL}/videos/${editingVideo._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/videos`;

      console.log("Submitting to:", endpoint);

      const response = await fetch(endpoint, {
        method: editingVideo ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload video");
      }

      const responseData = await response.json();
      console.log("Success response:", responseData);

      await fetchVideos();
      closeModal();
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFormData({ ...formData, videoFile: null });
      return;
    }

    // Validate file type
    const validTypes = ["video/mp4", "video/webm", "video/ogg"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid video file (MP4, WebM, or OGG)");
      e.target.value = "";
      return;
    }

    // Validate file size (1GB)
    const maxSize = 1024 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File is too large. Maximum size is 1GB");
      e.target.value = "";
      return;
    }

    console.log("Selected file:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    setFormData({ ...formData, videoFile: file });
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
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Upload New Video
      </button>

      {/* Video Form Modal */}
      <VideoFormModal
        show={showModal}
        onClose={closeModal}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        editingVideo={editingVideo}
        profiles={profiles}
        channels={channels}
      />

      {/* Videos List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          videos.map((video) => (
            <div key={video._id} className="bg-white p-4 rounded-lg shadow">
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
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEdit(video)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
