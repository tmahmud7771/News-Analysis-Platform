export default function VideoDetailModal({ video, onClose, show }) {
  if (!show || !video) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900 truncate">
            {video.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
          <div className="space-y-6">
            {/* Channels */}
            {video.channels && video.channels.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Channels
                </h3>
                <div className="flex flex-wrap gap-3">
                  {video.channels.map((channel, idx) => (
                    <div
                      key={idx}
                      className="flex items-center px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <img
                        src={channel.channel?.img || channel.img}
                        alt={channel.channel?.name || channel.name}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/32";
                        }}
                      />
                      <span className="ml-2 text-gray-800">
                        {channel.channel?.name || channel.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {video.description}
              </p>
            </div>

            {/* Related People */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Related People
              </h3>
              <div className="flex flex-wrap gap-2">
                {video.relatedPeople.map((person, idx) => (
                  <div
                    key={idx}
                    className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-800 rounded-full"
                  >
                    {person.person?.img && (
                      <img
                        src={person.person.img}
                        alt={person.person.name}
                        className="w-6 h-6 rounded-full object-cover mr-2"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/24";
                        }}
                      />
                    )}
                    <span>{person.person.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {video.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Date Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Date Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Incident Date</p>
                  <p className="text-gray-900">
                    {new Date(video.datetime).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Upload Date</p>
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
