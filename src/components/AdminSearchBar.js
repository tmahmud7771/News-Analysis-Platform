// components/AdminSearchBar.js
export default function AdminSearchBar({
  searchQuery,
  setSearchQuery,
  placeholder,
  onSearch,
}) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 border rounded-md"
      />
      <button
        onClick={onSearch}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}
