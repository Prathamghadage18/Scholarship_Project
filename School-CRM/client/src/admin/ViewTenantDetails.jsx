import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { listTenants, activateTenant, deleteTenant } from "../config/schoolSaas";
import { FaArrowLeft, FaToggleOn, FaToggleOff, FaTrash, FaShieldAlt } from "react-icons/fa";

export default function ViewTenantDetails() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadTenant();
  }, [tenantId]);

  const loadTenant = async () => {
    try {
      setLoading(true);
      const tenants = await listTenants();
      const foundTenant = tenants.find((t) => t.id === parseInt(tenantId));
      if (foundTenant) {
        setTenant(foundTenant);
      } else {
        toast.error("Tenant not found");
        navigate("/admin-dashboard");
      }
    } catch (error) {
      toast.error("Failed to load tenant details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!tenant) return;

    try {
      setToggling(true);
      const newStatus = !tenant.is_active;
      await activateTenant(tenant.id, newStatus);
      setTenant({ ...tenant, is_active: newStatus });
      toast.success(
        `Tenant ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      toast.error("Failed to update tenant status");
      console.error(error);
    } finally {
      setToggling(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setDeleteConfirmation("");
  };

  const handleDeleteConfirm = async () => {
    if (!tenant) return;

    if (deleteConfirmation !== tenant.name && deleteConfirmation !== tenant.subdomain) {
      toast.error("Confirmation must match tenant name or subdomain");
      return;
    }

    try {
      setDeleting(true);
      await deleteTenant(tenant.id, deleteConfirmation);
      toast.success("Tenant deleted successfully");
      setShowDeleteModal(false);
      navigate("/admin-dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete tenant");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Tenant not found</p>
          <Link
            to="/admin-dashboard"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin-dashboard"
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FaArrowLeft className="text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold">Tenant Details</h1>
        </div>
        <div
          className={`px-4 py-2 rounded-full font-semibold ${
            tenant.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {tenant.is_active ? "Active" : "Inactive"}
        </div>
      </div>

      {/* Tenant Information Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">School Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              School Name
            </label>
            <p className="text-lg font-medium">{tenant.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Subdomain
            </label>
            <p className="text-lg font-medium">{tenant.subdomain}.localhost</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Contact Email
            </label>
            <p className="text-lg font-medium">{tenant.contact_email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Tenant ID
            </label>
            <p className="text-lg font-medium font-mono">{tenant.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Created Date
            </label>
            <p className="text-lg font-medium">
              {new Date(tenant.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Status
            </label>
            <p className="text-lg font-medium">{tenant.is_active ? "Active" : "Inactive"}</p>
          </div>
        </div>

        {/* Status Toggle */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Tenant Status</h3>
              <p className="text-sm text-gray-500">
                {tenant.is_active
                  ? "Tenant is currently active and accessible"
                  : "Tenant is deactivated and blocked from access"}
              </p>
            </div>
            <button
              onClick={handleToggleStatus}
              disabled={toggling}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                toggling
                  ? "bg-gray-300 cursor-not-allowed"
                  : tenant.is_active
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {toggling ? (
                "Updating..."
              ) : tenant.is_active ? (
                <>
                  <FaToggleOff /> Deactivate
                </>
              ) : (
                <>
                  <FaToggleOn /> Activate
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <FaShieldAlt className="text-red-600 text-xl mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-red-800">Danger Zone</h2>
            <p className="text-sm text-red-600">
              Irreversible and destructive actions
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-red-800">Delete Tenant</h3>
              <p className="text-sm text-gray-600 mt-1">
                Permanently delete this tenant, all associated users, data, and
                database schema. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={handleDeleteClick}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              <FaTrash className="inline mr-2" />
              Delete Tenant
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-red-800 mb-4">
              Confirm Permanent Deletion
            </h2>
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                This action is <strong>permanent and irreversible</strong>.
              </p>
              <p className="text-gray-700 mb-4">
                The following will be deleted:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>All users associated with this tenant</li>
                <li>All student and teacher records</li>
                <li>Attendance and timetable data</li>
                <li>Database schema</li>
                <li>Domain/subdomain routing records</li>
              </ul>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <strong>"{tenant.name}"</strong> or{" "}
                <strong>"{tenant.subdomain}"</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter tenant name or subdomain"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={
                  deleting ||
                  (deleteConfirmation !== tenant.name &&
                    deleteConfirmation !== tenant.subdomain)
                }
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Confirm Permanent Deletion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
