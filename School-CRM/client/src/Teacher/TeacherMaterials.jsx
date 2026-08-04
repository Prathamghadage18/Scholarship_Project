import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../redux/authSlice";
import api from "../config/api";
import { getTeacherClass, getTeacherSubject, getTeacherUploadedMaterials } from "../config/admin";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherMaterials = () => {
  const years = ["2023", "2024", "2025"];

  const userId = useSelector(selectCurrentUserId);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);

  // ✅ Loading states
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

  const [form, setForm] = useState({
    year: "",
    classId: "",
    subject: "",
    title: "",
    description: "",
    file: null,
    url: "",
  });

  const [materials, setMaterials] = useState([]);
  const [filters, setFilters] = useState({
    year: "",
    classId: "",
    subject: "",
    search: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm((prev) => ({ ...prev, file: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpload = async () => {
    if (
      !form.year ||
      !form.classId ||
      !form.subject ||
      !form.title ||
      !(form.file || form.url)
    ) {
      toast.error("⚠️ Please fill all required fields.");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("classId", form.classId);
      fd.append("subject", form.subject);
      fd.append("year", form.year);
      fd.append("isPublic", true);
      if (form.file) fd.append("file", form.file);
      if (form.url) fd.append("linkUrl", form.url);

      const res = await api.post("/api/teacher/materials", fd);

      setMaterials((prev) => [res.data.data.studyMaterial, ...prev]);
      toast.success("✅ Study material uploaded!");

      setForm({
        year: "",
        classId: "",
        subject: "",
        title: "",
        description: "",
        file: null,
        url: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'uploading error');
    }
  };

  useEffect(() => {
    if (userId) {
      (async () => {
        const data = await getTeacherUploadedMaterials();
        setMaterials(data || []);
      })();
    }
  }, [userId]);

  const deleteStudyMaterial = async (materialId) => {
    try {
      const res = await api.delete(`/api/teacher/materials/${materialId}`);
      toast.success(res.data.message || "Deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Error deleting study material"
      );
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      deleteStudyMaterial(id);
    }
  };

  // Apply filters
  const filteredMaterials = materials.filter((m) => {
    return (
      (!filters.year || m.year === filters.year) &&
      (!filters.classId || m.class === filters.classId) &&
      (!filters.subject || m.subject === filters.subject) &&
      (!filters.search ||
        m.title.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  return (
    <div className="sm:p-6 p-2">
      {/* Upload Section */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">📚 Upload Study Material</h2>
        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className="border rounded px-3 py-2"
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
            value={form.classId}
            onChange={handleChange}
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
            value={form.subject}
            onChange={handleChange}
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

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border rounded px-3 py-2 md:col-span-2"
          />

          <input type="file" name="file" onChange={handleChange} />
          <input
            type="url"
            name="url"
            placeholder="or Paste Link URL"
            value={form.url}
            onChange={handleChange}
            className="border rounded px-3 py-2 md:col-span-2"
          />
        </div>

        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Upload Material
        </button>
      </div>

      {/* Uploaded Materials Section */}
      <div className="bg-white shadow rounded-xl p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">📂 Uploaded Materials</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filters.year}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, year: e.target.value }))
            }
            className="border rounded px-3 py-2"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={filters.classId}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, classId: e.target.value }))
            }
            className="border rounded px-3 py-2"
            disabled={loadingClasses}
          >
            {loadingClasses ? (
              <option>Loading classes...</option>
            ) : (
              <>
                <option value="">All Classes</option>
                {classes.map((n) => (
                  <option key={n} value={n}>
                    class {n}
                  </option>
                ))}
              </>
            )}
          </select>

          <select
            value={filters.subject}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, subject: e.target.value }))
            }
            className="border rounded px-3 py-2"
            disabled={loadingSubjects}
          >
            {loadingSubjects ? (
              <option>Loading subjects...</option>
            ) : (
              <>
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s._id || s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </>
            )}
          </select>

          <input
            type="text"
            placeholder="🔍 Search Title"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="border rounded px-3 py-2 flex-1"
          />
        </div>

        {filteredMaterials.length === 0 ? (
          <p className="text-gray-500">No materials uploaded yet.</p>
        ) : (
          <div className="space-y-4">
            {filteredMaterials.map((m) => (
              <div
                key={m._id}
                className="p-5 border rounded-2xl shadow-sm hover:shadow-md transition bg-white flex flex-col md:flex-row justify-between gap-6"
              >
                {/* Left Side */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {m.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {m.subject} | class {m.class}
                  </p>
                  <p className="text-sm text-gray-500">{m.description}</p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {m.file && (
                      <a
                        href={`${BASE_URL}/${m.file?.path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 font-medium hover:underline"
                      >
                        📄 View Document
                      </a>
                    )}
                    {m.link && (
                      <a
                        href={m.link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 font-medium hover:underline"
                      >
                        🔗 Visit Link
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col items-end justify-between gap-3">
                  <button
                    onClick={() => handleDeleteClick(m._id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                  >
                    Delete
                  </button>
                  <p className="text-xs text-gray-500">
                    {new Date(m.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherMaterials;