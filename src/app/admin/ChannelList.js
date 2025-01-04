// app/admin/ChannelList.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";

export default function ChannelList() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingChannel, setEditingChannel] = useState(null);
  const { getToken } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    img: "",
  });

  const fetchChannels = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/channels`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch channels");

      const data = await res.json();
      if (data.status === "success") {
        setChannels(data.data);
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
      alert("Failed to load channels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editingChannel
        ? `${process.env.NEXT_PUBLIC_API_URL}/channels/${editingChannel._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/channels`;

      const response = await fetch(endpoint, {
        method: editingChannel ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save channel");
      }

      await fetchChannels();
      resetForm();
    } catch (error) {
      console.error("Error saving channel:", error);
      alert(error.message);
    }
  };

  const handleDelete = async (channelId) => {
    if (!confirm("Are you sure? This might affect videos using this channel."))
      return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/channels/${channelId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      await fetchChannels();
    } catch (error) {
      console.error("Error deleting channel:", error);
      alert(error.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingChannel(null);
    setFormData({ name: "", img: "" });
  };

  return (
    <div className="space-y-6">
      {/* Add Channel Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Channel
        </button>
      )}

      {/* Channel Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Channel Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="text"
                value={formData.img}
                onChange={(e) =>
                  setFormData({ ...formData, img: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {formData.img && (
              <div className="mt-2">
                <img
                  src={formData.img}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80";
                  }}
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editingChannel ? "Update Channel" : "Create Channel"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Channels List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : channels.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No channels found
          </div>
        ) : (
          channels.map((channel) => (
            <div key={channel._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <img
                    src={channel.img}
                    alt={channel.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/48";
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{channel.name}</h3>
                    <p className="text-sm text-gray-500">
                      Created:{" "}
                      {new Date(channel.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingChannel(channel);
                      setFormData({
                        name: channel.name,
                        img: channel.img,
                      });
                      setShowForm(true);
                    }}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(channel._id)}
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
