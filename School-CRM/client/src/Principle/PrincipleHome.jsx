import React from "react";

const PrincipleHome = () => {
  return (
    <div className="space-y-6  lg:w-10/12 m-auto">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h3 className="text-sm text-gray-500">Total Students</h3>
          <p className="text-2xl font-bold text-blue-600">1,247</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h3 className="text-sm text-gray-500">Active Teachers</h3>
          <p className="text-2xl font-bold text-green-600">87</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h3 className="text-sm text-gray-500">Attendance Rate</h3>
          <p className="text-2xl font-bold text-purple-600">94.2%</p>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6 space-y-3">
          <h2 className="text-lg font-bold">📑 Recent Activity</h2>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="font-medium">New study material uploaded</p>
            <p className="text-sm text-gray-600">
              Mathematics - Chapter 5 by Ms. Wilson
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="font-medium">Attendance marked for Class 10A</p>
            <p className="text-sm text-gray-600">28/30 students present</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6 space-y-3">
          <h2 className="text-lg font-bold">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg shadow text-center">
              📢 <br /> Send Announcement
            </button>
            <button className="bg-green-50 hover:bg-green-100 p-4 rounded-lg shadow text-center">
              👥 <br /> Manage Users
            </button>
            <button className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg shadow text-center">
              📊 <br /> View Analytics
            </button>
            <button className="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg shadow text-center">
              📄 <br /> Generate Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipleHome;
