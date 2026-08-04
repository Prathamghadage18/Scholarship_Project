import React, { useState } from "react";
import { toast } from "sonner";
import api from "../config/api";

const AdminAddTenant = () => {
  const [form, setForm] = useState({
    name: "",
    subdomain: "",
    contact_email: "",
    logo: null,
    is_active: true,
    admin_first_name: "",
    admin_last_name: "",
    admin_email: "",
    admin_password: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: e.target.checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.subdomain || !form.contact_email) {
      return toast.error("Please fill all required tenant fields");
    }
    if (!form.admin_first_name || !form.admin_last_name || !form.admin_email || !form.admin_password) {
      return toast.error("Please fill all admin details");
    }
    if (form.admin_password.length < 8) {
      return toast.error("Admin password must be at least 8 characters");
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(form.subdomain)) {
      return toast.error("Subdomain can only contain lowercase letters, numbers, and hyphens");
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("subdomain", form.subdomain);
    formData.append("contact_email", form.contact_email);
    if (form.logo) {
      formData.append("logo", form.logo);
    }
    formData.append("is_active", form.is_active);
    formData.append("admin_first_name", form.admin_first_name);
    formData.append("admin_last_name", form.admin_last_name);
    formData.append("admin_email", form.admin_email);
    formData.append("admin_password", form.admin_password);

    await toast.promise(
      api.post("/api/tenants/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      {
        loading: "Creating tenant and admin user...",
        success: (res) => {
          toast.success(`Tenant "${form.name}" created successfully! Principal username: ${form.subdomain}_admin`);
          setForm({
            name: "",
            subdomain: "",
            contact_email: "",
            logo: null,
            is_active: true,
            admin_first_name: "",
            admin_last_name: "",
            admin_email: "",
            admin_password: "",
          });
        },
        error: (err) => {
          const errorMsg = err.response?.data?.detail || 
                          err.response?.data?.message ||
                          Object.values(err.response?.data || {}).join(", ") ||
                          "Error creating tenant. Please try again.";
          return errorMsg;
        },
      }
    );
  };

  return (
    <div className="p-6 bg-white shadow-md max-w-4xl m-auto">
      <h2 className="text-2xl font-bold mb-6">Create New School Tenant</h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Tenant Information Section */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">School Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">School Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Riverside High School"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subdomain *</label>
                <input
                  type="text"
                  name="subdomain"
                  placeholder="e.g., riverside"
                  value={form.subdomain}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  School will be accessible at: {form.subdomain || "subdomain"}.localhost
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email *</label>
                <input
                  type="email"
                  name="contact_email"
                  placeholder="school@example.com"
                  value={form.contact_email}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">School Logo</label>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Optional: Upload school logo</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="is_active" className="text-sm">Activate tenant immediately</label>
              </div>
            </div>
          </div>

          {/* Admin Information Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Principal (Admin) Information</h3>
            <p className="text-sm text-gray-600 mb-4">
              The principal will be automatically created as the first admin user for this school.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Admin First Name *</label>
                <input
                  type="text"
                  name="admin_first_name"
                  placeholder="John"
                  value={form.admin_first_name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Admin Last Name *</label>
                <input
                  type="text"
                  name="admin_last_name"
                  placeholder="Doe"
                  value={form.admin_last_name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Admin Email *</label>
                <input
                  type="email"
                  name="admin_email"
                  placeholder="principal@riverside.edu"
                  value={form.admin_email}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Admin Password *</label>
                <input
                  type="password"
                  name="admin_password"
                  placeholder="Min 8 characters"
                  value={form.admin_password}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                  minLength={8}
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The principal's username will be automatically generated as 
                <code className="bg-blue-100 px-1 rounded"> {form.subdomain || "subdomain"}_admin</code>
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-primary text-white font-semibold rounded-md py-3 hover:bg-primary/90 transition"
            >
              Create Tenant & Principal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminAddTenant;
