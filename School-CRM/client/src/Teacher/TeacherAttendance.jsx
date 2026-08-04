import React, { useState, useEffect } from "react";
import { toast } from "sonner"; // notification
import api from "../config/api";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../redux/authSlice";
import { getTeacherClass, getTeacherSubject } from "../config/admin";

const TeacherAttendance = () => {
  const years = ["2023", "2024", "2025"];
  const userId = useSelector(selectCurrentUserId);

  // States
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  // Loading states
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Selected filters
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  // 🔹 Fetch subjects and classes for teacher
  useEffect(() => {
    if (userId) {
      (async () => {
        try {
          setLoadingSubjects(true);
          const subject = await getTeacherSubject();
          setSubjects(subject || []);
        } finally {
          setLoadingSubjects(false);
        }

        try {
          setLoadingClasses(true);
          const myclass = await getTeacherClass();
          setClasses(myclass || []);
        } finally {
          setLoadingClasses(false);
        }
      })();
    }
  }, [userId]);

  // 🔹 Fetch students (you can filter by class if backend supports it)
  const getStudents = async (classId) => {
    setLoadingStudents(true);
    try {
      let url = "/api/admin/user/student";
      if (classId) url = `/api/admin/class/${classId}/students`; // ✅ optional filter
      const res = await api.get(url);
      setStudents(res.data.data.map((s) => ({ ...s, status: null })));
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("⚠️ Failed to fetch students");
    } finally {
      setLoadingStudents(false);
    }
  };

  // Refetch students whenever class changes
  useEffect(() => {
    if (selectedClass) {
      getStudents(selectedClass);
    }
  }, [selectedClass]);

  // 🔹 Mark attendance for a student
  const markAttendance = (id, status) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, status } : s))
    );
  };

  // 🔹 Submit attendance
  const submitAttendance = async () => {
    try {
      if (!selectedYear || !selectedClass || !selectedSubject) {
        toast.error("⚠️ Please select year, class, and subject first.");
        return;
      }

      const payload = {
        classId: selectedClass, // ✅ backend expects ID
        year: selectedYear,
        subject: selectedSubject, // ✅ use subjectId here
        date: new Date(),
        students: students.map((s) => ({
          student: s._id,
          status: s.status ? s.status.toLowerCase() : "absent", // normalize
        })),
      };

      const res = await api.post("/api/teacher/attendance", payload);
      toast.success("✅ " + res.data.message);
      console.log("Attendance response:", res.data);
    } catch (err) {
      console.error("Error submitting attendance:", err);
      toast.error(err.response?.data?.message || "❌ Error submitting");
    }
  };

  return (
    <div className="relative sm:p-6 p-2 min-h-screen overflow-hidden">
      <div className="relative bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">✅ Attendance Management</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Year */}
          <select
            className="border rounded px-3 py-2"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Class */}
          <select
            name="classId"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border rounded px-3 py-2"
            disabled={loadingClasses}
          >
            {loadingClasses ? (
              <option>Loading classes...</option>
            ) : (
              <>
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name || `Class ${c._id}`}
                  </option>
                ))}
              </>
            )}
          </select>

          {/* Subject */}
          <select
            name="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border rounded px-3 py-2"
            disabled={loadingSubjects}
          >
            {loadingSubjects ? (
              <option>Loading subjects...</option>
            ) : (
              <>
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow">
            <thead className="bg-primaryLight">
              <tr>
                <th className="py-2 px-4 border-b text-left">Roll Number</th>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Phone</th>
                <th className="py-2 px-4 border-b text-left">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {loadingStudents ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading students...
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{s.rollNumber}</td>
                    <td className="py-2 px-4 border-b">
                      {s.firstName} {s.lastName}
                    </td>
                    <td className="py-2 px-4 border-b">{s.phone}</td>
                    <td className="py-2 px-4 border-b flex gap-2">
                      <button
                        onClick={() => markAttendance(s._id, "present")}
                        className={`px-3 py-1 rounded-lg ${
                          s.status === "present"
                            ? "bg-green-600 text-white"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markAttendance(s._id, "absent")}
                        className={`px-3 py-1 rounded-lg ${
                          s.status === "absent"
                            ? "bg-red-600 text-white"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        Absent
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Submit Button */}
        <button
          onClick={submitAttendance}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
};
export default TeacherAttendance;