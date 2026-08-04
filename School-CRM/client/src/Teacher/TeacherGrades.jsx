import React, { useEffect, useState } from "react";
import { selectCurrentUserId } from "../redux/authSlice";
import { useSelector } from "react-redux";
import { getTeacherClass, getTeacherSubject } from "../config/admin";

const TeacherGrades = () => {
  // Dropdown options
  const years = ["2023", "2024", "2025"];

  // ✅ Loading states
  const userId = useSelector(selectCurrentUserId);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);

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

  // Selected filters
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  // Students state (dynamic later)
  const [students, setStudents] = useState([
    { id: 1, name: "Alice Johnson", quiz1: 85, quiz2: 92, assignment: 88, grade: "A" },
    { id: 2, name: "Bob Smith", quiz1: 75, quiz2: 80, assignment: 82, grade: "B+" },
    { id: 3, name: "Carol Davis", quiz1: 90, quiz2: 94, assignment: 91, grade: "A-" },
  ]);

  // Handle input change
  const handleGradeChange = (id, field, value) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, [field]: Number(value) } : s
      )
    );
  };

  // Save all grades
  const saveGrades = () => {
    console.log("Saving grades:", {
      year: selectedYear,
      class: selectedClass,
      subject: selectedSubject,
      students,
    });
    alert("Grades saved successfully ✅");
  };

  return (
    <div className="sm:p-6 p-2">
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">📝 Grade Management</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
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
                {classes.map((n) => (
                  <option key={n} value={n}>
                    class {n}
                  </option>
                ))}
              </>
            )}
          </select>

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
                  <option key={s._id || s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3">Student</th>
                <th className="p-3">Quiz 1</th>
                <th className="p-3">Quiz 2</th>
                <th className="p-3">Assignment</th>
                <th className="p-3">Final Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={s.quiz1}
                      onChange={(e) =>
                        handleGradeChange(s.id, "quiz1", e.target.value)
                      }
                      className="border rounded px-2 py-1 w-20"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={s.quiz2}
                      onChange={(e) =>
                        handleGradeChange(s.id, "quiz2", e.target.value)
                      }
                      className="border rounded px-2 py-1 w-20"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={s.assignment}
                      onChange={(e) =>
                        handleGradeChange(s.id, "assignment", e.target.value)
                      }
                      className="border rounded px-2 py-1 w-20"
                    />
                  </td>
                  <td className="p-3 font-semibold text-green-600">
                    {s.grade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Save Button */}
        <button
          onClick={saveGrades}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Save All Grades
        </button>
      </div>
    </div>
  );
};

export default TeacherGrades;
