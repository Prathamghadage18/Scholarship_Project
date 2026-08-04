import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getSchoolPerformance,
  calculateSchoolMetrics,
  listTenants,
} from "../config/schoolSaas";
import { FaChartLine, FaSchool, FaUsers, FaTrophy, FaSync } from "react-icons/fa";

export default function SchoolAnalytics() {
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [performanceData, setPerformanceData] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [filters, setFilters] = useState({
    academic_year: "2025-2026",
    term: "Term 1",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [performance, tenantsData] = await Promise.all([
        getSchoolPerformance(filters),
        listTenants(),
      ]);
      setPerformanceData(performance);
      setTenants(tenantsData);
    } catch (error) {
      toast.error("Failed to load analytics data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateMetrics = async () => {
    try {
      setCalculating(true);
      await calculateSchoolMetrics(filters);
      toast.success("Metrics calculated successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to calculate metrics");
      console.error(error);
    } finally {
      setCalculating(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return "bg-green-100 text-green-700";
    if (percentage >= 80) return "bg-blue-100 text-blue-700";
    if (percentage >= 70) return "bg-yellow-100 text-yellow-700";
    if (percentage >= 60) return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">School Performance Analytics</h1>
          <p className="text-gray-500">Monitor and analyze school performance across all tenants</p>
        </div>
        <button
          onClick={handleCalculateMetrics}
          disabled={calculating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <FaSync className={calculating ? "animate-spin" : ""} />
          {calculating ? "Calculating..." : "Calculate Metrics"}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <button
          onClick={loadData}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Apply Filters
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : performanceData.length > 0 ? (
        <div>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Schools</p>
                  <p className="text-2xl font-bold">{performanceData.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaSchool className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-2xl font-bold">
                    {performanceData.reduce((sum, d) => sum + d.total_students, 0)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FaUsers className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Performance</p>
                  <p className="text-2xl font-bold">
                    {(
                      performanceData.reduce((sum, d) => sum + d.average_percentage, 0) /
                      performanceData.length
                    ).toFixed(1)}
                    %
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FaChartLine className="text-yellow-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Pass Rate</p>
                  <p className="text-2xl font-bold">
                    {(
                      performanceData.reduce((sum, d) => sum + d.pass_percentage, 0) /
                      performanceData.length
                    ).toFixed(1)}
                    %
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <FaTrophy className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* School Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performanceData.map((school) => (
              <div
                key={school.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{school.school_name}</h3>
                    <p className="text-sm text-gray-500">{school.school_subdomain}.localhost</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getPerformanceColor(
                      school.average_percentage
                    )}`}
                  >
                    {school.average_percentage.toFixed(1)}%
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Students</span>
                    <span className="font-medium">{school.total_students}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Pass Rate</span>
                    <span className="font-medium">{school.pass_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Attendance</span>
                    <span className="font-medium">{school.average_attendance.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Scholarship Rate</span>
                    <span className="font-medium">
                      {school.scholarship_participation_rate.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Performance:</span>{" "}
                    {getPerformanceLevel(school.average_percentage)}
                  </p>
                </div>

                <div className="mt-2 text-xs text-gray-400">
                  Updated: {new Date(school.calculated_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">
            No performance data available. Click "Calculate Metrics" to generate analytics.
          </p>
        </div>
      )}
    </div>
  );
}
