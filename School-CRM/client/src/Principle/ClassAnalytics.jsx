import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getClassPerformance } from "../config/schoolSaas";
import { FaChartLine, FaUsers, FaBook, FaTrophy } from "react-icons/fa";

export default function ClassAnalytics() {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState(null);
  const [filters, setFilters] = useState({
    class_name: "",
    section: "",
    term: "Term 1",
    academic_year: "2025-2026",
  });

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const loadPerformanceData = async () => {
    if (!filters.class_name || !filters.section) {
      return;
    }

    try {
      setLoading(true);
      const data = await getClassPerformance(filters);
      setPerformanceData(data);
    } catch (error) {
      toast.error("Failed to load performance data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    loadPerformanceData();
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Good";
    if (percentage >= 70) return "Average";
    if (percentage >= 60) return "Below Average";
    return "Poor";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Class Performance Analytics</h1>
        <p className="text-gray-500">Monitor and analyze class performance metrics</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <input
              type="text"
              name="class_name"
              value={filters.class_name}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <input
              type="text"
              name="section"
              value={filters.section}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Term
            </label>
            <select
              name="term"
              value={filters.term}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year
            </label>
            <input
              type="text"
              name="academic_year"
              value={filters.academic_year}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="2025-2026"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Load Analytics
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : performanceData ? (
        <div>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-2xl font-bold">{performanceData.total_students}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaUsers className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Class Average</p>
                  <p className={`text-2xl font-bold ${getGradeColor(performanceData.class_average)}`}>
                    {performanceData.class_average}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FaChartLine className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pass Rate</p>
                  <p className={`text-2xl font-bold ${getGradeColor(performanceData.pass_rate)}`}>
                    {performanceData.pass_rate}%
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FaBook className="text-yellow-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Performance</p>
                  <p className="text-lg font-bold text-gray-900">
                    {getPerformanceLevel(performanceData.class_average)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <FaTrophy className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Subject-wise Performance</h2>
            {performanceData.subject_performance.length > 0 ? (
              <div className="space-y-4">
                {performanceData.subject_performance.map((subject) => (
                  <div key={subject.subject_name} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{subject.subject_name}</span>
                      <span className="text-sm text-gray-500">
                        {subject.total_students} students
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Average Marks</p>
                        <p className="font-semibold">{subject.average_marks}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pass Rate</p>
                        <p className="font-semibold">{subject.pass_rate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No subject data available</p>
            )}
          </div>

          {/* Student Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Student Performance Ranking</h2>
            {performanceData.student_performance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Rank
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Percentage
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {performanceData.student_performance.map((student, index) => (
                      <tr key={student.student_id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="font-semibold">#{index + 1}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {student.student_name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`font-semibold ${getGradeColor(student.percentage)}`}>
                            {student.percentage}%
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {getPerformanceLevel(student.percentage)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No student data available</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">
            Enter class and section to view performance analytics
          </p>
        </div>
      )}
    </div>
  );
}
