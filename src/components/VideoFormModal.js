// components/VideoFormModal.js
export default function VideoFormModal({
  show,
  onClose,
  formData,
  setFormData,
  handleSubmit,
  editingVideo,
  profiles,
  channels,
}) {
  if (!show) return null;

  // Ensure formData.channels is initialized as an empty array if undefined
  if (!formData.channels) {
    formData.channels = [];
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["video/mp4", "video/webm", "video/ogg"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid video file (MP4, WebM, or OGG)");
        e.target.value = "";
        return;
      }

      // Validate file size (1GB max)
      const maxSize = 1024 * 1024 * 1024; // 1GB in bytes
      if (file.size > maxSize) {
        alert("File size must be less than 1GB");
        e.target.value = "";
        return;
      }

      setFormData({ ...formData, videoFile: file });

      console.log("Selected file:", formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingVideo ? "Edit Video" : "Upload New Video"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
          encType="multipart/form-data"
        >
          {/* Title */}
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

          {/* Description */}
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

          {/* Keywords */}
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
            />
          </div>

          {/* Related People */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Related People
            </label>
            <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
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

          {/* Channels Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channels
            </label>
            <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {channels.map((channel) => (
                <label
                  key={channel._id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={formData.channels?.some(
                      (c) => c.channel === channel._id
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          channels: [
                            ...formData.channels,
                            {
                              channel: channel._id,
                              name: channel.name,
                            },
                          ],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          channels: formData.channels.filter(
                            (c) => c.channel !== channel._id
                          ),
                        });
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <div className="flex items-center">
                    <img
                      src={channel.img}
                      alt={channel.name}
                      className="w-6 h-6 rounded-full mr-2"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/24";
                      }}
                    />
                    <span className="text-sm text-gray-600">
                      {channel.name}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Date and Time */}
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

          {/* Video File */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Video File{" "}
              {editingVideo && "(Leave empty to keep existing video)"}
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="video/mp4,video/webm,video/ogg"
              className="mt-1 w-full"
              required={!editingVideo}
            />
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingVideo ? "Update Video" : "Upload Video"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
