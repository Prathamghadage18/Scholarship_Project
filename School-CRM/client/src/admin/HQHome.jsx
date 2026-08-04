import React, { useEffect, useState } from "react";
import { FaSchool, FaUserTie } from "react-icons/fa";
import { Link } from "react-router-dom";
import { listTenants } from "../config/schoolSaas";

export default function HQHome() {
  const [schools, setSchools] = useState(0);
  const [principals, setPrincipals] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const tenantList = await listTenants();
        setSchools(tenantList.length);
        // Each tenant has one principal, so count equals schools
        setPrincipals(tenantList.length);
      } catch (error) {
        console.error("Error fetching HQ dashboard data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = [
    {
      title: "Schools",
      value: schools,
      icon: <FaSchool />,
      color: "bg-orange-100 text-orange-600",
      link: "/admin-dashboard/add-tenant",
    },
    {
      title: "Principals",
      value: principals,
      icon: <FaUserTie />,
      color: "bg-purple-100 text-purple-600",
      link: "/admin-dashboard/add-tenant",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">HQ Dashboard</h2>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Link to={item.link} key={item.title}>
            <div className="flex items-center justify-between rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg">
              <div>
                <h3 className="text-sm text-gray-500">{item.title}</h3>
                <p className="text-2xl font-bold">{loading ? "..." : item.value}</p>
              </div>
              <div className={`rounded-full p-3 text-xl ${item.color}`}>{item.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Link to="/admin-dashboard/tenants">
          <div className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-700 p-6 text-white shadow-md transition hover:opacity-90">
            <h3 className="text-lg font-semibold">Manage Tenants</h3>
            <p className="mt-2 text-sm">View, activate, deactivate, or delete school tenants.</p>
          </div>
        </Link>

        <Link to="/admin-dashboard/add-tenant">
          <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-700 p-6 text-white shadow-md transition hover:opacity-90">
            <h3 className="text-lg font-semibold">Create New Tenant</h3>
            <p className="mt-2 text-sm">Add a new school with its principal admin.</p>
          </div>
        </Link>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h3 className="mb-4 text-xl font-semibold">HQ Overview</h3>
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-2">
          <div>
            <p className="text-2xl font-bold text-orange-600">{loading ? "..." : schools}</p>
            <p className="text-sm text-gray-500">Active School Tenants</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{loading ? "..." : principals}</p>
            <p className="text-sm text-gray-500">School Principals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
