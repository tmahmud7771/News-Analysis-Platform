// components/SearchAnalytics.js
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react"; // If using lucide-react

const COLORS = ["#64B5F6", "#81C784", "#FFD54F", "#FF8A65", "#9575CD"];

export default function SearchAnalytics({
  searchResults,
  searchQuery,
  selectedProfiles,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!searchResults?.length) return null;

  // Calculate people frequency
  const peopleStats = {};
  searchResults.forEach((video) => {
    video.relatedPeople.forEach((person) => {
      peopleStats[person.person.name] =
        (peopleStats[person.person.name] || 0) + 1;
    });
  });

  const channelStats = {};
  searchResults.forEach((video) => {
    if (video.channels && Array.isArray(video.channels)) {
      video.channels.forEach((channel) => {
        if (channel?.channel?.name) {
          channelStats[channel.channel.name] =
            (channelStats[channel.channel.name] || 0) + 1;
        }
      });
    }
  });

  // Prepare data for pie chart
  const peopleData = Object.entries(peopleStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // Prepare data for channel pie chart
  const channelData = Object.entries(channelStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5) // Get top 5 channels
    .map(([name, value]) => ({ name, value }));

  // Calculate monthly distribution
  const monthStats = {};
  searchResults.forEach((video) => {
    const date = new Date(video.datetime);
    const monthYear = date.toLocaleDateString("default", {
      month: "short",
      year: "numeric",
    });
    monthStats[monthYear] = (monthStats[monthYear] || 0) + 1;
  });

  // Prepare data for bar chart
  const timeData = Object.entries(monthStats)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, count]) => ({
      date,
      videos: count,
    }));

  // Quick stats for collapsed view
  const quickStats = {
    videos: searchResults.length,
    people: Object.keys(peopleStats).length,
    periods: Object.keys(monthStats).length,
    keywords: searchResults.reduce(
      (acc, video) => acc + video.keywords.length,
      0
    ),
  };

  return (
    <div className="bg-white rounded-xl shadow-lg transition-all duration-300">
      {/* Collapsible Header */}
      <div
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Search Results Analysis
              </h2>
              <ChevronDown
                className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </div>
            {/* Quick Stats - Visible when collapsed */}
            {!isExpanded && (
              <div className="mt-2 flex gap-6 text-sm text-gray-500">
                <span>{quickStats.videos} videos</span>
                <span>{quickStats.people} people</span>
                <span>{quickStats.periods} time periods</span>
                <span>{quickStats.keywords} keywords</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className={`px-14 pb-14 ${isExpanded ? "border-t" : ""}`}>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 mb-10">
            <div className="bg-blue-50 p-6 rounded-lg flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600">
                {quickStats.videos}
              </div>
              <div className="text-sm text-blue-500">Total Videos</div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg flex flex-col items-center">
              <div className="text-3xl font-bold text-green-600">
                {quickStats.people}
              </div>
              <div className="text-sm text-green-500">People Featured</div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg flex flex-col items-center">
              <div className="text-3xl font-bold text-purple-600">
                {quickStats.periods}
              </div>
              <div className="text-sm text-purple-500">Time Periods</div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-600">
                {quickStats.keywords}
              </div>
              <div className="text-sm text-yellow-500">Total Keywords</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* People Distribution Pie Chart */}
            <div className="h-[300px]">
              <h3 className="font-semibold mb-4 text-gray-700">
                Most Featured People
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={peopleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {peopleData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Channel Distribution Pie Chart */}
            <div className="h-[300px]">
              <h3 className="font-semibold mb-4 text-gray-700">
                Channel Distribution
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {channelData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[(index + 2) % COLORS.length]} // Offset colors to differentiate from people chart
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Time Distribution Bar Chart */}
            <div className="h-[300px]">
              <h3 className="font-semibold mb-4 text-gray-700">
                Time Distribution
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeData}>
                  <XAxis dataKey="date" tick={{ fill: "#6B7280" }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#6B7280" }} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="videos"
                    fill="#9575CD"
                    name="Number of Videos"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
