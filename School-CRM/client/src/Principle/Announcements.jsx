import React from "react";

const Announcements = () => {
  const announcements = [
    {
      title: "Parent-Teacher Meeting",
      scope: "School-wide",
      date: "2024-01-15",
      desc: "Scheduled for next Friday at 3 PM",
    },
    {
      title: "Math Quiz Tomorrow",
      scope: "Class",
      date: "2024-01-14",
      desc: "Chapter 4-5 will be covered",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4 lg:w-10/12 m-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">📢 Announcements</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          + New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((a, i) => (
          <div
            key={i}
            className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50 transition"
          >
            <div>
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-sm text-gray-600">{a.desc}</p>
              <p className="text-xs text-gray-500">{a.date}</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span
                className={`px-2 py-1 rounded-lg text-xs ${
                  a.scope === "School-wide"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {a.scope}
              </span>
              <button className="text-blue-600">Edit</button>
              <button className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
