import React from "react";

const StudentGrades = () => {
  const subjects = [
    { name: "Mathematics", grade: "A", percent: 90, remark: "Excellent performance", color: "bg-green-500" },
    { name: "Science", grade: "A-", percent: 85, remark: "Good work", color: "bg-blue-500" },
    { name: "English", grade: "A", percent: 88, remark: "Strong writing skills", color: "bg-green-500" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6 lg:w-10/12 m-auto">
      <h2 className="text-lg font-bold flex items-center gap-2">📑 My Grades</h2>

      {/* Overall Grades */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-6 rounded-lg text-center">
          <p className="text-3xl font-bold text-green-600">A-</p>
          <p className="text-gray-600">Overall Grade</p>
          <p className="text-sm text-gray-500">GPA: 3.7/4.0</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <p className="text-3xl font-bold text-blue-600">7th</p>
          <p className="text-gray-600">Class Rank</p>
          <p className="text-sm text-gray-500">Out of 30 students</p>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div>
        <h3 className="font-semibold flex items-center gap-2 mb-2">📊 Subject-wise Performance</h3>
        <div className="space-y-4">
          {subjects.map((subj, index) => (
            <div key={index} className="p-4 rounded-lg border">
              <div className="flex justify-between mb-1">
                <span className="font-medium">{subj.name}</span>
                <span className="font-bold">{subj.grade}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className={`h-2 rounded-full ${subj.color}`}
                  style={{ width: `${subj.percent}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {subj.percent}% • {subj.remark}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentGrades;
