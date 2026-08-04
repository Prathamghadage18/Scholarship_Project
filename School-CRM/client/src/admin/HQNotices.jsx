import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  listNotices,
  createNotice,
  deleteNotice,
  acknowledgeNotice,
  listTenants,
} from "../config/schoolSaas";
import { FaBell, FaPlus, FaTrash, FaCheck, FaExclamationTriangle } from "react-icons/fa";

export default function HQNotices() {
  const [notices, setNotices] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    school: "",
    title: "",
    description: "",
    notice_type: "general",
    priority: "medium",
    action_required: false,
    action_deadline: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [noticesData, tenantsData] = await Promise.all([
        listNotices(),
        listTenants(),
      ]);
      setNotices(noticesData);
      setTenants(tenantsData);
    } catch (error) {
      toast.error("Failed to load notices");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNotice(formData);
      toast.success("Notice issued successfully");
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      toast.error("Failed to issue notice");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await deleteNotice(id);
        toast.success("Notice deleted successfully");
        loadData();
      } catch (error) {
        toast.error("Failed to delete notice");
        console.error(error);
      }
    }
  };

  const handleAcknowledge = async (noticeId) => {
    const actionTaken = prompt("Enter action taken (optional):");
    try {
      await acknowledgeNotice(noticeId, { action_taken: actionTaken || "" });
      toast.success("Notice acknowledged successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to acknowledge notice");
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      school: "",
      title: "",
      description: "",
      notice_type: "general",
      priority: "medium",
      action_required: false,
      action_deadline: "",
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getNoticeTypeColor = (type) => {
    switch (type) {
      case "performance_warning":
        return "bg-red-50 border-red-200";
      case "compliance":
        return "bg-blue-50 border-blue-200";
      case "urgent":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-white border-gray-200";
    }
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
        <div>
          <h1 className="text-2xl font-bold">HQ Notices</h1>
          <p className="text-gray-500">Issue and manage notices to schools</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          Issue Notice
        </button>
      </div>

      {/* Notices List */}
      {notices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">No notices issued yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-lg shadow-md p-6 border ${getNoticeTypeColor(
                notice.notice_type
              )}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                        notice.priority
                      )}`}
                    >
                      {notice.priority}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                      {notice.notice_type.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    To: {notice.school_name} ({notice.school_subdomain}.localhost)
                  </p>
                  <p className="text-gray-700 mb-3">{notice.description}</p>
                  
                  {notice.action_required && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <FaExclamationTriangle />
                        <span className="font-medium">Action Required</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        Deadline: {new Date(notice.action_deadline).toLocaleDateString()}
                      </p>
                      {notice.action_taken && (
                        <p className="text-sm text-green-700 mt-1">
                          Action Taken: {notice.action_taken}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      Issued: {new Date(notice.issued_date).toLocaleDateString()}
                    </span>
                    <span>By: {notice.issued_by_name}</span>
                    {notice.is_acknowledged && (
                      <span className="text-green-600">
                        ✓ Acknowledged by {notice.acknowledged_by_name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {!notice.is_acknowledged && (
                    <button
                      onClick={() => handleAcknowledge(notice.id)}
                      className="px-3 py-2 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 transition"
                      title="Acknowledge"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notice.id)}
                    className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Issue Notice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Issue Notice</h2>
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
                  School
                </label>
                <select
                  value={formData.school}
                  onChange={(e) =>
                    setFormData({ ...formData, school: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select School</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name} ({tenant.subdomain})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Notice title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Notice details"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notice Type
                  </label>
                  <select
                    value={formData.notice_type}
                    onChange={(e) =>
                      setFormData({ ...formData, notice_type: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="general">General Notice</option>
                    <option value="performance_warning">
                      Performance Warning
                    </option>
                    <option value="compliance">Compliance Notice</option>
                    <option value="urgent">Urgent Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="action_required"
                  checked={formData.action_required}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      action_required: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <label htmlFor="action_required" className="text-sm font-medium text-gray-700">
                  Action Required
                </label>
              </div>

              {formData.action_required && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.action_deadline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        action_deadline: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Issue Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
