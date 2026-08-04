import React, { useState } from "react";
import {  FaHome,  FaBook,  FaClipboardList,  FaCheckCircle,  FaBars,} from "react-icons/fa";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HiX } from "react-icons/hi";
import StudentGrades from "./StudentGrades";
import StudentMaterials from "./StudentMaterials";
import StudentHome from "./StudentHome";
import StudentAttendance from "./StudentAttendance";
import ProtectedRoute from "../config/ProtectedRoute";
import GradientCircles from "../components/ui/GradientCircles";
import Progress from "./Progress";
import BusTracking from "./BusTracking";
import Logo from "../assets/logo.png";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { logout } from "../redux/authSlice";

export default function StudentDashboard() {
  const params = useParams();
  const currentPath = params["*"];
  const [menuOpen, setMenuOpen] = useState(true); // desktop sidebar
  const [isOpen, setIsOpen] = useState(false); // mobile sidebar

  const NavigationItem = [
    { icon: <FaHome />, label: "Dashboard", path: "/student-dashboard", active: currentPath === "" },
    { icon: <FaBook />, label: "Materials", path: "/student-dashboard/materials", active: currentPath === "materials" },
    { icon: <FaClipboardList />, label: "Grades", path: "/student-dashboard/grades", active: currentPath === "grades" },
    { icon: <FaCheckCircle />, label: "Attendance", path: "/student-dashboard/attendance", active: currentPath === "attendance" },
    { icon: <FaCheckCircle />, label: "Progress", path: "/student-dashboard/progress", active: currentPath === "progress" },
    // { icon: <FaCheckCircle />, label: "Bus Tracking", path: "/student-dashboard/bus-tracking", active: currentPath === "bus-tracking" },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout Successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <GradientCircles />

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex ${menuOpen ? "w-64" : "w-16"} h-screen bg-[#0b0d7496] shadow-lg transition-all duration-300 flex-col fixed left-0 top-0 z-20`}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/">
            <div className="font-bold text-xl text-white flex gap-1 items-center">
              <img src={Logo} alt="" className="w-10" />
              {menuOpen ? "Scout Team" : ""}
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
                item.active ? "bg-primary text-white" : "text-gray-200 hover:bg-blue-800"
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
            className="w-full font-semibold text-sm text-white bg-red-500 px-2 py-2 rounded-md mb-2"
            title="sign out"
          >
            {menuOpen ? "Sign Out" : <RiLogoutCircleRLine className="font-semibold" />}
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 bg-[#0b0d7496] shadow-lg sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="logo" className="w-8 h-8 object-contain" />
          <span className="text-lg font-bold text-white">Scout Team</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md text-gray-200  focus:outline-none"
        >
          <FaBars className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu (Drawer) */}
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

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed top-0 right-0 w-72 h-full bg-[#0b0d7496] shadow-xl z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <img src={Logo} alt="logo" className="w-10 h-10 object-contain" />
                  <span className="text-xl font-bold text-white">Scout Team</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md text-gray-300 hover:text-primary focus:outline-none"
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
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                        link.active ? "bg-primary text-white" : "text-gray-200 hover:bg-blue-800"
                      }`}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.label}</span>
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
          <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
            <Route path="/" element={<StudentHome />} />
            <Route path="materials" element={<StudentMaterials />} />
            <Route path="grades" element={<StudentGrades />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="progress" element={<Progress />} />
            <Route path="bus-tracking" element={<BusTracking />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}