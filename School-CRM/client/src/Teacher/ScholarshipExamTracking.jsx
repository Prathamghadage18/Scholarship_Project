import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  listScholarshipExams,
  createScholarshipExam,
  updateScholarshipExam,
  deleteScholarshipExam,
  listExamParticipations,
  createExamParticipation,
  listExamResults,
  createExamResult,
  listStudents,
} from "../config/schoolSaas";
import { FaTrophy, FaUserPlus, FaChartBar, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function ScholarshipExamTracking() {
  const [exams, setExams] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("exams");
  const [showExamModal, setShowExamModal] = useState(false);
  const [showParticipationModal, setShowParticipationModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  const [examFormData, setExamFormData] = useState({
    name: "",
    description: "",
    exam_date: "",
    registration_deadline: "",
    max_marks: "",
    passing_marks: "",
    fee: "",
    is_active: true,
  });

  const [participationFormData, setParticipationFormData] = useState({
    exam: "",
    student: "",
    roll_number: "",
    exam_center: "",
    fee_paid: false,
    fee_payment_date: "",
    payment_reference: "",
  });

  const [resultFormData, setResultFormData] = useState({
    participation: "",
    marks_obtained: "",
    grade: "",
    rank: "",
    percentile: "",
    scholarship_awarded: false,
    scholarship_amount: "",
    remarks: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [examsData, participationsData, resultsData, studentsData] =
        await Promise.all([
          listScholarshipExams(),
          listExamParticipations(),
          listExamResults(),
          listStudents(),
        ]);
      setExams(examsData);
      setParticipations(participationsData);
      setResults(resultsData);
      setStudents(studentsData);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExamSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExam) {
        await updateScholarshipExam(editingExam.id, examFormData);
        toast.success("Exam updated successfully");
      } else {
        await createScholarshipExam(examFormData);
        toast.success("Exam created successfully");
      }
      setShowExamModal(false);
      setEditingExam(null);
      resetExamForm();
      loadData();
    } catch (error) {
      toast.error("Failed to save exam");
      console.error(error);
    }
  };

  const handleParticipationSubmit = async (e) => {
    e.preventDefault();
    try {
      await createExamParticipation(participationFormData);
      toast.success("Student registered successfully");
      setShowParticipationModal(false);
      resetParticipationForm();
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to register student");
      console.error(error);
    }
  };

  const handleResultSubmit = async (e) => {
    e.preventDefault();
    try {
      await createExamResult(resultFormData);
      toast.success("Result added successfully");
      setShowResultModal(false);
      resetResultForm();
      loadData();
    } catch (error) {
      toast.error("Failed to add result");
      console.error(error);
    }
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await deleteScholarshipExam(id);
        toast.success("Exam deleted successfully");
        loadData();
      } catch (error) {
        toast.error("Failed to delete exam");
        console.error(error);
      }
    }
  };

  const resetExamForm = () => {
    setExamFormData({
      name: "",
      description: "",
      exam_date: "",
      registration_deadline: "",
      max_marks: "",
      passing_marks: "",
      fee: "",
      is_active: true,
    });
  };

  const resetParticipationForm = () => {
    setParticipationFormData({
      exam: "",
      student: "",
      roll_number: "",
      exam_center: "",
      fee_paid: false,
      fee_payment_date: "",
      payment_reference: "",
    });
  };

  const resetResultForm = () => {
    setResultFormData({
      participation: "",
      marks_obtained: "",
      grade: "",
      rank: "",
      percentile: "",
      scholarship_awarded: false,
      scholarship_amount: "",
      remarks: "",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
        <h1 className="text-2xl font-bold">Scholarship Exams</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("exams")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "exams"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaTrophy className="inline mr-2" />
          Exams
        </button>
        <button
          onClick={() => setActiveTab("participations")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "participations"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaUserPlus className="inline mr-2" />
          Participations
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "results"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaChartBar className="inline mr-2" />
          Results
        </button>
      </div>

      {/* Exams Tab */}
      {activeTab === "exams" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">All Exams</h2>
            <button
              onClick={() => {
                resetExamForm();
                setEditingExam(null);
                setShowExamModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FaPlus />
              Create Exam
            </button>
          </div>

          {exams.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 mb-4">No scholarship exams created yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <FaTrophy className="text-yellow-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{exam.name}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(exam.exam_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        exam.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {exam.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max Marks</span>
                      <span className="font-medium">{exam.max_marks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Passing</span>
                      <span className="font-medium">{exam.passing_marks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fee</span>
                      <span className="font-medium">${exam.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Deadline</span>
                      <span className="font-medium">
                        {new Date(exam.registration_deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <button
                      onClick={() => {
                        setEditingExam(exam);
                        setExamFormData({
                          name: exam.name,
                          description: exam.description,
                          exam_date: exam.exam_date,
                          registration_deadline: exam.registration_deadline,
                          max_marks: exam.max_marks,
                          passing_marks: exam.passing_marks,
                          fee: exam.fee,
                          is_active: exam.is_active,
                        });
                        setShowExamModal(true);
                      }}
                      className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                    >
                      <FaEdit className="inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteExam(exam.id)}
                      className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                    >
                      <FaTrash className="inline mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Participations Tab */}
      {activeTab === "participations" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Student Registrations</h2>
            <button
              onClick={() => {
                resetParticipationForm();
                setShowParticipationModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FaUserPlus />
              Register Student
            </button>
          </div>

          {participations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 mb-4">No student registrations yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Exam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Roll Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Exam Center
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fee Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {participations.map((participation) => (
                    <tr key={participation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{participation.student_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {participation.exam_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {participation.roll_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {participation.exam_center}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            participation.fee_paid
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {participation.fee_paid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Results Tab */}
      {activeTab === "results" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Exam Results</h2>
            <button
              onClick={() => {
                resetResultForm();
                setShowResultModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FaChartBar />
              Add Result
            </button>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 mb-4">No results declared yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 rounded-full">
                        <FaChartBar className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {result.student_name}
                        </h3>
                        <p className="text-sm text-gray-500">{result.exam_name}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-lg font-bold rounded-full ${
                        result.grade.startsWith("A")
                          ? "bg-green-100 text-green-700"
                          : result.grade.startsWith("B")
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {result.grade}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Marks Obtained</span>
                      <span className="font-medium">{result.marks_obtained}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rank</span>
                      <span className="font-medium">{result.rank || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Percentile</span>
                      <span className="font-medium">
                        {result.percentile ? result.percentile.toFixed(1) + "%" : "N/A"}
                      </span>
                    </div>
                  </div>

                  {result.scholarship_awarded && (
                    <div className="mt-4 pt-4 border-t bg-green-50 -mx-6 px-6 pb-4 rounded-b-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <FaTrophy />
                        <span className="font-semibold">
                          Scholarship Awarded: ${result.scholarship_amount}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Exam Modal */}
      {showExamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingExam ? "Edit Exam" : "Create Exam"}
              </h2>
              <button
                onClick={() => {
                  setShowExamModal(false);
                  setEditingExam(null);
                  resetExamForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleExamSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Name
                </label>
                <input
                  type="text"
                  value={examFormData.name}
                  onChange={(e) =>
                    setExamFormData({ ...examFormData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={examFormData.description}
                  onChange={(e) =>
                    setExamFormData({
                      ...examFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    value={examFormData.exam_date}
                    onChange={(e) =>
                      setExamFormData({
                        ...examFormData,
                        exam_date: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Deadline
                  </label>
                  <input
                    type="date"
                    value={examFormData.registration_deadline}
                    onChange={(e) =>
                      setExamFormData({
                        ...examFormData,
                        registration_deadline: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Marks
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={examFormData.max_marks}
                    onChange={(e) =>
                      setExamFormData({
                        ...examFormData,
                        max_marks: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passing Marks
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={examFormData.passing_marks}
                    onChange={(e) =>
                      setExamFormData({
                        ...examFormData,
                        passing_marks: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fee ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={examFormData.fee}
                  onChange={(e) =>
                    setExamFormData({ ...examFormData, fee: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={examFormData.is_active}
                  onChange={(e) =>
                    setExamFormData({
                      ...examFormData,
                      is_active: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowExamModal(false);
                    setEditingExam(null);
                    resetExamForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingExam ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Participation Modal */}
      {showParticipationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Register Student</h2>
              <button
                onClick={() => {
                  setShowParticipationModal(false);
                  resetParticipationForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleParticipationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam
                </label>
                <select
                  value={participationFormData.exam}
                  onChange={(e) =>
                    setParticipationFormData({
                      ...participationFormData,
                      exam: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Exam</option>
                  {exams
                    .filter((exam) => exam.is_active)
                    .map((exam) => (
                      <option key={exam.id} value={exam.id}>
                        {exam.name} - {new Date(exam.exam_date).toLocaleDateString()}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student
                </label>
                <select
                  value={participationFormData.student}
                  onChange={(e) =>
                    setParticipationFormData({
                      ...participationFormData,
                      student: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.user.first_name} {student.user.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roll Number
                </label>
                <input
                  type="text"
                  value={participationFormData.roll_number}
                  onChange={(e) =>
                    setParticipationFormData({
                      ...participationFormData,
                      roll_number: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Center
                </label>
                <input
                  type="text"
                  value={participationFormData.exam_center}
                  onChange={(e) =>
                    setParticipationFormData({
                      ...participationFormData,
                      exam_center: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="fee_paid"
                  checked={participationFormData.fee_paid}
                  onChange={(e) =>
                    setParticipationFormData({
                      ...participationFormData,
                      fee_paid: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <label htmlFor="fee_paid" className="text-sm font-medium text-gray-700">
                  Fee Paid
                </label>
              </div>

              {participationFormData.fee_paid && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      value={participationFormData.fee_payment_date}
                      onChange={(e) =>
                        setParticipationFormData({
                          ...participationFormData,
                          fee_payment_date: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Reference
                    </label>
                    <input
                      type="text"
                      value={participationFormData.payment_reference}
                      onChange={(e) =>
                        setParticipationFormData({
                          ...participationFormData,
                          payment_reference: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowParticipationModal(false);
                    resetParticipationForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Add Result</h2>
              <button
                onClick={() => {
                  setShowResultModal(false);
                  resetResultForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleResultSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Participation
                </label>
                <select
                  value={resultFormData.participation}
                  onChange={(e) =>
                    setResultFormData({
                      ...resultFormData,
                      participation: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Participation</option>
                  {participations.map((participation) => (
                    <option key={participation.id} value={participation.id}>
                      {participation.student_name} - {participation.exam_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marks Obtained
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={resultFormData.marks_obtained}
                    onChange={(e) =>
                      setResultFormData({
                        ...resultFormData,
                        marks_obtained: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade
                  </label>
                  <input
                    type="text"
                    value={resultFormData.grade}
                    onChange={(e) =>
                      setResultFormData({
                        ...resultFormData,
                        grade: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="A+, A, B, etc."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rank
                  </label>
                  <input
                    type="number"
                    value={resultFormData.rank}
                    onChange={(e) =>
                      setResultFormData({
                        ...resultFormData,
                        rank: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Percentile
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={resultFormData.percentile}
                    onChange={(e) =>
                      setResultFormData({
                        ...resultFormData,
                        percentile: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="scholarship_awarded"
                  checked={resultFormData.scholarship_awarded}
                  onChange={(e) =>
                    setResultFormData({
                      ...resultFormData,
                      scholarship_awarded: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <label htmlFor="scholarship_awarded" className="text-sm font-medium text-gray-700">
                  Scholarship Awarded
                </label>
              </div>

              {resultFormData.scholarship_awarded && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scholarship Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={resultFormData.scholarship_amount}
                    onChange={(e) =>
                      setResultFormData({
                        ...resultFormData,
                        scholarship_amount: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={resultFormData.remarks}
                  onChange={(e) =>
                    setResultFormData({
                      ...resultFormData,
                      remarks: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowResultModal(false);
                    resetResultForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
