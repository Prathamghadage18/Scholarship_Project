import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaUser,
  FaCheckCircle,
  FaBell,
  FaUserFriends,
  FaBars,
  FaChartLine,
  FaBell as FaNotification,
} from "react-icons/fa";

import { RiLogoutCircleRLine } from "react-icons/ri";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HiX } from "react-icons/hi";
import ProtectedRoute from "../config/ProtectedRoute";

import HQHome from "./HQHome";
import AdminAddTenant from "./AdminAddTenant";
import TenantList from "./TenantList";
import ViewTenantDetails from "./ViewTenantDetails";
import SchoolAnalytics from "./SchoolAnalytics";
import HQNotices from "./HQNotices";

import Logo from "../assets/logo.png"; // replace if needed
import GradientCircles from "../components/ui/GradientCircles";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { toast } from "sonner";


export default function AdminDashboard() {
  const params = useParams();
  const currentPath = params["*"];
  const [menuOpen, setMenuOpen] = useState(true); // desktop sidebar
  const [isOpen, setIsOpen] = useState(false); // mobile sidebar

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const NavigationItem = [
    { icon: <FaCalendarAlt />, label: "Dashboard", path: "/admin-dashboard", active: currentPath === "" },
    { icon: <FaCheckCircle />, label: "Manage Tenants", path: "/admin-dashboard/tenants", active: currentPath === "tenants" },
    { icon: <FaCheckCircle />, label: "Add Tenant", path: "/admin-dashboard/add-tenant", active: currentPath === "add-tenant" },
    { icon: <FaChartLine />, label: "School Analytics", path: "/admin-dashboard/school-analytics", active: currentPath === "school-analytics" },
    { icon: <FaNotification />, label: "HQ Notices", path: "/admin-dashboard/hq-notices", active: currentPath === "hq-notices" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout Successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <GradientCircles/>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex ${menuOpen ? "w-64" : "w-16"} h-screen bg-[#0b0d7496] shadow-lg transition-all duration-300 flex-col fixed left-0 top-0 z-20`}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/">
            <div className="font-bold text-lg text-white flex gap-2 items-center">
              <img src={Logo} alt="Logo" className="w-8" />
              {menuOpen ? "CRM Admin" : ""}
            </div>
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-100 px-2">
            {menuOpen ? <HiX /> : <FaBars />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {NavigationItem.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                item.active ? "bg-primary text-white" : "text-white hover:bg-blue-700"
              }`}
              title={item.label}
            >
              <span className="text-lg">{item.icon}</span>
              {menuOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full font-semibold text-sm text-white bg-red-500 px-2 py-2 rounded-md"
            title="Logout"
          >
            {menuOpen ? "Sign Out" : <RiLogoutCircleRLine />}
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 bg-[#0b0d7496] shadow-lg sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="logo" className="w-8 h-8 object-contain" />
          <span className="text-lg font-bold text-white">Admin Panel</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md text-gray-200"
        >
          <FaBars className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed top-0 right-0 w-72 h-full bg-[#0b0d7496] shadow-xl z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <img src={Logo} alt="logo" className="w-8 h-8" />
                  <span className="text-xl font-bold text-white">Admin Panel</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-300 hover:text-indigo-400"
                >
                  <HiX className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4">
                <ul className="space-y-4">
                  {NavigationItem.map((link) => (
                    <Link
                      key={link.label}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold ${
                        link.active ? "bg-primary text-white" : "text-white hover:bg-blue-700"
                      }`}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="font-semibold">{link.label}</span>
                    </Link>
                  ))}
                </ul>

                <div className="mt-8 space-y-4">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full font-semibold text-sm text-white bg-red-500 px-2 py-2 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`flex-1 ${menuOpen ? "md:ml-64" : "md:ml-16"} sm:p-4 h-screen overflow-y-auto transition-all duration-300`}
      >
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={["HQ"]} />}>
            <Route index element={<HQHome />} />
            <Route path="tenants" element={<TenantList />} />
            <Route path="tenants/:tenantId" element={<ViewTenantDetails />} />
            <Route path="add-tenant" element={<AdminAddTenant />} />
            <Route path="school-analytics" element={<SchoolAnalytics />} />
            <Route path="hq-notices" element={<HQNotices />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}
