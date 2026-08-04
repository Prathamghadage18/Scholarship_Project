import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  listAnswerSheets,
  createAnswerSheet,
  deleteAnswerSheet,
  listSubjects,
  listStudents,
} from "../config/schoolSaas";
import { FaUpload, FaTrash, FaCloudUploadAlt, FaLink } from "react-icons/fa";

export default function AnswerSheetUpload() {
  const [answerSheets, setAnswerSheets] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    student: "",
    subject: "",
    exam_name: "",
    exam_date: "",
    upload_type: "direct_upload",
    file: null,
    drive_link: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [answerSheetsData, subjectsData, studentsData] = await Promise.all([
        listAnswerSheets(),
        listSubjects(),
        listStudents(),
      ]);
      setAnswerSheets(answerSheetsData);
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
      setUploading(true);
      
      const payload = {
        student: formData.student,
        subject: formData.subject,
        exam_name: formData.exam_name,
        exam_date: formData.exam_date,
        upload_type: formData.upload_type,
      };

      if (formData.upload_type === "direct_upload" && formData.file) {
        payload.file = formData.file;
      }

      if (formData.upload_type === "drive_link" && formData.drive_link) {
        payload.drive_link = formData.drive_link;
      }

      await createAnswerSheet(payload);
      toast.success("Answer sheet uploaded successfully");
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      toast.error("Failed to upload answer sheet");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this answer sheet?")) {
      try {
        await deleteAnswerSheet(id);
        toast.success("Answer sheet deleted successfully");
        loadData();
      } catch (error) {
        toast.error("Failed to delete answer sheet");
        console.error(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      student: "",
      subject: "",
      exam_name: "",
      exam_date: "",
      upload_type: "direct_upload",
      file: null,
      drive_link: "",
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFormData({ ...formData, file });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
        <h1 className="text-2xl font-bold">Answer Sheets</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FaUpload />
          Upload Answer Sheet
        </button>
      </div>

      {/* Answer Sheets Grid */}
      {answerSheets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">No answer sheets uploaded yet.</p>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Upload First Answer Sheet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {answerSheets.map((sheet) => (
            <div
              key={sheet.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    {sheet.upload_type === "direct_upload" ? (
                      <FaCloudUploadAlt className="text-blue-600 text-xl" />
                    ) : (
                      <FaLink className="text-blue-600 text-xl" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {sheet.student_name}
                    </h3>
                    <p className="text-sm text-gray-500">{sheet.subject_name}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(sheet.id)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Exam</span>
                  <span className="font-medium text-sm">{sheet.exam_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="font-medium text-sm">
                    {new Date(sheet.exam_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Type</span>
                  <span className="font-medium text-sm capitalize">
                    {sheet.upload_type.replace("_", " ")}
                  </span>
                </div>
              </div>

              {sheet.file_url && (
                <div className="mt-4 pt-4 border-t">
                  <a
                    href={sheet.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View File
                  </a>
                </div>
              )}

              {sheet.drive_link && (
                <div className="mt-4 pt-4 border-t">
                  <a
                    href={sheet.drive_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Open Drive Link
                  </a>
                </div>
              )}

              <div className="mt-4 pt-4 border-t text-xs text-gray-400">
                Uploaded on {new Date(sheet.uploaded_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Upload Answer Sheet</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student
                </label>
                <select
                  value={formData.student}
                  onChange={(e) =>
                    setFormData({ ...formData, student: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Name
                </label>
                <input
                  type="text"
                  value={formData.exam_name}
                  onChange={(e) =>
                    setFormData({ ...formData, exam_name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Mid-Term Exam"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Date
                </label>
                <input
                  type="date"
                  value={formData.exam_date}
                  onChange={(e) =>
                    setFormData({ ...formData, exam_date: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Type
                </label>
                <select
                  value={formData.upload_type}
                  onChange={(e) =>
                    setFormData({ ...formData, upload_type: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="direct_upload">Direct File Upload</option>
                  <option value="drive_link">Google Drive Link</option>
                </select>
              </div>

              {formData.upload_type === "direct_upload" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File (Max 10MB)
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  {formData.file && (
                    <p className="text-sm text-gray-500 mt-1">
                      Selected: {formData.file.name}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Drive Link
                  </label>
                  <input
                    type="url"
                    value={formData.drive_link}
                    onChange={(e) =>
                      setFormData({ ...formData, drive_link: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://drive.google.com/..."
                    required
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
