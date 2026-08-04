import React from "react";

const StudentAttendance = () => {
  const attendanceData = [
    { date: "January 15, 2024", status: "Present" },
    { date: "January 14, 2024", status: "Present" },
    { date: "January 13, 2024", status: "Absent" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6 lg:w-10/12 m-auto">
      <h2 className="text-lg font-bold flex items-center gap-2">
        ✅ My Attendance
      </h2>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-600">95%</p>
          <p className="text-gray-600">Overall Attendance</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-600">19</p>
          <p className="text-gray-600">Days Present</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-red-600">1</p>
          <p className="text-gray-600">Days Absent</p>
        </div>
      </div>

      {/* Recent Attendance */}
      <div>
        <h3 className="font-semibold flex items-center gap-2 mb-2">📅 Recent Attendance</h3>
        <div className="divide-y rounded-lg border">
          {attendanceData.map((record, index) => (
            <div key={index} className="flex justify-between items-center p-3">
              <span>{record.date}</span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  record.status === "Present"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {record.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
