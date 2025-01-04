"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import ProfileFormModal from "@/components/ProfileFormModal";
import AdminSearchBar from "@/components/AdminSearchBar";

export default function ProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const fetchProfiles = async (query = "") => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/persons`;
      if (query) {
        url += `/search?query=${encodeURIComponent(query)}`;
      }

      const res = await fetch(url, {
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

  const handleSearch = () => {
    fetchProfiles(searchQuery);
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
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProfile(null);
    setFormData({
      name: "",
      occupation: "",
      description: "",
      aliases: "",
      img: "",
    });
  };

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

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save profile");
      }

      await fetchProfiles();
      closeModal();
    } catch (error) {
      console.error("Error saving profile:", error);
      alert(error.message);
    }
  };

  const handleDelete = async (profileId) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;

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
        await fetchProfiles();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete profile");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert(error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Profile Button */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add New Profile
      </button>

      {/* Search Bar */}
      {/* <div className="bg-white p-4 rounded-lg shadow">
        <AdminSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search profiles by name, occupation..."
          onSearch={handleSearch}
        />
      </div> */}

      {/* Profile Form Modal */}
      <ProfileFormModal
        show={showModal}
        onClose={closeModal}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        editingProfile={editingProfile}
      />

      {/* Profiles List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          profiles.map((profile) => (
            <div key={profile._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between">
                <div className="flex gap-4">
                  {/* Profile Image - 120px width */}
                  <div className="w-[120px] h-[120px]">
                    <img
                      src={profile.img}
                      alt={profile.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/120"; // Fallback image
                      }}
                    />
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold">{profile.name}</h3>
                    <p className="text-sm text-gray-600">
                      {profile.occupation.join(", ")}
                    </p>
                    <p className="text-gray-700">{profile.description}</p>
                    {profile.aliases.length > 0 && (
                      <p className="text-sm text-gray-500">
                        Also known as: {profile.aliases.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(profile)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 h-fit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(profile._id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 h-fit"
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
