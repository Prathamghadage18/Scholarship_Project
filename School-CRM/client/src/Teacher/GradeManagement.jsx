import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  listGrades,
  createGrade,
  updateGrade,
  deleteGrade,
  listSubjects,
  listStudents,
} from "../config/schoolSaas";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

export default function GradeManagement() {
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [formData, setFormData] = useState({
    student: "",
    subject: "",
    term: "Term 1",
    academic_year: "2025-2026",
    marks_obtained: "",
    max_marks: "",
    grade_letter: "",
    remarks: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gradesData, subjectsData, studentsData] = await Promise.all([
        listGrades(),
        listSubjects(),
        listStudents(),
      ]);
      setGrades(gradesData);
      setSubjects(subjectsData);
      setStudents(studentsData);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGrade) {
        await updateGrade(editingGrade.id, formData);
        toast.success("Grade updated successfully");
      } else {
        await createGrade(formData);
        toast.success("Grade created successfully");
      }
      setShowModal(false);
      setEditingGrade(null);
      resetForm();
      loadData();
    } catch (error) {
      toast.error("Failed to save grade");
      console.error(error);
    }
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setFormData({
      student: grade.student,
      subject: grade.subject,
      term: grade.term,
      academic_year: grade.academic_year,
      marks_obtained: grade.marks_obtained,
      max_marks: grade.max_marks,
      grade_letter: grade.grade_letter,
      remarks: grade.remarks,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      try {
        await deleteGrade(id);
        toast.success("Grade deleted successfully");
        loadData();
      } catch (error) {
        toast.error("Failed to delete grade");
        console.error(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      student: "",
      subject: "",
      term: "Term 1",
      academic_year: "2025-2026",
      marks_obtained: "",
      max_marks: "",
      grade_letter: "",
      remarks: "",
    });
  };

  const calculateGradeLetter = (marks, maxMarks) => {
    if (!marks || !maxMarks) return "";
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Grade Management</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingGrade(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          Add Grade
        </button>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Term
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Academic Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {grades.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  No grades found. Click "Add Grade" to create one.
                </td>
              </tr>
            ) : (
              grades.map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{grade.student_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-500">{grade.subject_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {grade.term}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {grade.academic_year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {grade.marks_obtained} / {grade.max_marks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        grade.grade_letter.startsWith("A")
                          ? "bg-green-100 text-green-700"
                          : grade.grade_letter.startsWith("B")
                          ? "bg-blue-100 text-blue-700"
                          : grade.grade_letter.startsWith("C")
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {grade.grade_letter}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEdit(grade)}
                      className="text-blue-600 hover:text-blue-800 mr-3 transition"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(grade.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingGrade ? "Edit Grade" : "Add Grade"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingGrade(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student
                </label>
                <select
                  value={formData.student}
                  onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.user.first_name} {student.user.last_name} ({student.class_name}-{student.section})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Term
                  </label>
                  <select
                    value={formData.term}
                    onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
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
                    value={formData.academic_year}
                    onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2025-2026"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marks Obtained
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.marks_obtained}
                    onChange={(e) => {
                      const marks = parseFloat(e.target.value);
                      setFormData({ 
                        ...formData, 
                        marks_obtained: marks,
                        grade_letter: calculateGradeLetter(marks, parseFloat(formData.max_marks))
                      });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Marks
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.max_marks}
                    onChange={(e) => {
                      const maxMarks = parseFloat(e.target.value);
                      setFormData({ 
                        ...formData, 
                        max_marks: maxMarks,
                        grade_letter: calculateGradeLetter(parseFloat(formData.marks_obtained), maxMarks)
                      });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade Letter
                </label>
                <input
                  type="text"
                  value={formData.grade_letter}
                  onChange={(e) => setFormData({ ...formData, grade_letter: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="A+, A, B, C, D, F"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Optional remarks"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingGrade(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <FaSave />
                  {editingGrade ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
