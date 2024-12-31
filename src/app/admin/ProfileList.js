// app/admin/ProfileList.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";

export default function ProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const { getToken } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    occupation: "",
    description: "",
    aliases: "",
    img: "",
  });

  const fetchProfiles = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editingProfile
        ? `${process.env.NEXT_PUBLIC_API_URL}/persons/${editingProfile._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/persons`;

      const method = editingProfile ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          ...formData,
          occupation: formData.occupation.split(",").map((item) => item.trim()),
          aliases: formData.aliases.split(",").map((item) => item.trim()),
        }),
      });

      if (response.ok) {
        fetchProfiles();
        setShowForm(false);
        setEditingProfile(null);
        setFormData({
          name: "",
          occupation: "",
          description: "",
          aliases: "",
          img: "",
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleEdit = (profile) => {
    setEditingProfile(profile);
    setFormData({
      name: profile.name,
      occupation: profile.occupation.join(", "),
      description: profile.description,
      aliases: profile.aliases.join(", "),
      img: profile.img,
    });
    setShowForm(true);
  };

  const handleDelete = async (profileId) => {
    if (confirm("Are you sure you want to delete this profile?")) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/persons/${profileId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (response.ok) {
          fetchProfiles();
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Profile Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Profile
        </button>
      )}

      {/* Profile Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Occupation (comma-separated)
            </label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) =>
                setFormData({ ...formData, occupation: e.target.value })
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
              Aliases (comma-separated)
            </label>
            <input
              type="text"
              value={formData.aliases}
              onChange={(e) =>
                setFormData({ ...formData, aliases: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border rounded-md"
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
              className="mt-1 w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingProfile ? "Update Profile" : "Create Profile"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingProfile(null);
                setFormData({
                  name: "",
                  occupation: "",
                  description: "",
                  aliases: "",
                  img: "",
                });
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Profiles List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          profiles.map((profile) => (
            <div key={profile._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{profile.name}</h3>
                  <p className="text-sm text-gray-600">
                    {profile.occupation.join(", ")}
                  </p>
                  <p className="mt-2">{profile.description}</p>
                  {profile.aliases.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Also known as: {profile.aliases.join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(profile)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(profile._id)}
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
