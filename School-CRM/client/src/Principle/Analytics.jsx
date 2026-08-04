import React from "react";

const Analytics = () => {
  return (
    <div className="space-y-6 lg:w-10/12 m-auto">
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white rounded-xl p-6 shadow">
          <h3 className="text-sm">Average Attendance</h3>
          <p className="text-2xl font-bold">94.2%</p>
          <p className="text-xs opacity-80">↑ 2.1% from last month</p>
        </div>
        <div className="bg-green-500 text-white rounded-xl p-6 shadow">
          <h3 className="text-sm">Average GPA</h3>
          <p className="text-2xl font-bold">3.6</p>
          <p className="text-xs opacity-80">↑ 0.2 from last semester</p>
        </div>
        <div className="bg-purple-500 text-white rounded-xl p-6 shadow">
          <h3 className="text-sm">Materials Shared</h3>
          <p className="text-2xl font-bold">156</p>
          <p className="text-xs opacity-80">This month</p>
        </div>
        <div className="bg-orange-500 text-white rounded-xl p-6 shadow">
          <h3 className="text-sm">Parent Engagement</h3>
          <p className="text-2xl font-bold">98.5%</p>
          <p className="text-xs opacity-80">Portal usage rate</p>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {/* Attendance Trends */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4">📊 Attendance Trends</h2>
          <p className="text-gray-500 text-sm mb-4">
            Interactive attendance chart would be displayed here
          </p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>January - <span className="font-semibold">94.2%</span></li>
            <li>December - <span className="font-semibold">92.1%</span></li>
            <li>November - <span className="font-semibold">93.8%</span></li>
          </ul>
        </div>

        {/* Performance by Subject */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4">🎯 Performance by Subject</h2>
          {[
            { subject: "Mathematics", percent: 85, color: "bg-blue-500" },
            { subject: "Science", percent: 78, color: "bg-green-500" },
            { subject: "English", percent: 82, color: "bg-purple-500" },
            { subject: "History", percent: 76, color: "bg-orange-500" },
          ].map((item, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm">
                <span>{item.subject}</span>
                <span>{item.percent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full ${item.color}`}
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
