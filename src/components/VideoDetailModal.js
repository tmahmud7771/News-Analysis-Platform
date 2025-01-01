// components/VideoDetailModal.js
export default function VideoDetailModal({ video, onClose, show }) {
  if (!show || !video) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header with Close Button */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{video.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Video Player */}
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video
              src={video.videoLink}
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
          </div>

          {/* Video Information */}
          <div className="space-y-4">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {video.description}
              </p>
            </div>

            {/* Related People */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Related People
              </h3>
              <div className="flex flex-wrap gap-2">
                {video.relatedPeople.map((person, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                  >
                    {person.person.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {video.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Date Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Date Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Incident Date</p>
                  <p className="text-gray-900">
                    {new Date(video.datetime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Upload Date</p>
                  <p className="text-gray-900">
                    {new Date(video.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
