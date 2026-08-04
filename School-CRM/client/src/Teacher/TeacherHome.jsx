import React, { useEffect, useState } from "react";
import { FaRocket, FaCalendarAlt, FaUpload, FaCheckSquare, FaFileAlt, FaBullhorn } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAllStudent, getTeacherClass, getTeacherUploadedMaterials } from "../config/admin";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../redux/authSlice";

const TeacherHome = () => {

  const [materails, setMaterails] = useState();
  const [students, setStudents] = useState();
  const [classes, setClasses] = useState();

  const userId = useSelector(selectCurrentUserId);

  useEffect(() => {
    if (userId) {
      (async () => {
        const material = await getTeacherUploadedMaterials();
        setMaterails(material.length);
        const student = await getAllStudent();
        setStudents(student.length);
        const myclass = await getTeacherClass();
        setClasses(myclass.length);
      })();
    }
  }, [userId])

  return (
    <div className="sm:p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
        <div className=" bg-[#4267ff] rounded-xl shadow p-4 text-center">
          <h2 className="text-3xl font-bold text-white text-shadow">{classes}</h2>
          <p className="text-white font-semibold">My Classes</p>
        </div>
        <div className="bg-[#3aaa2b] rounded-xl shadow p-4 text-center ">
          <h2 className="text-3xl font-bold text-white text-shadow">{students}</h2>
          <p className="text-white font-semibold">Total Students</p>
        </div>
        <div className="bg-[#8346e5] rounded-xl shadow p-4 text-center">
          <h2 className="text-3xl font-bold text-white text-shadow">{materails}</h2>
          <p className="text-white font-semibold">Materials Shared</p>
        </div>
        <div className="bg-[#e54646] rounded-xl shadow p-4 text-center">
          <h2 className="text-3xl font-bold text-white text-shadow">7</h2>
          <p className="text-white font-semibold">Pending Grades</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-600" /> Today's Schedule
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50">
              <div>
                <p className="font-medium ">Mathematics - Class 10A</p>
                <p className="text-sm text-gray-500">9:00 AM - 10:00 AM</p>
              </div>
              <button className="text-blue-600 font-medium">Mark Attendance</button>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
              <div>
                <p className="font-medium ">Mathematics - Class 10B</p>
                <p className="text-sm text-gray-500">11:00 AM - 12:00 PM</p>
              </div>
              <button className="text-green-600 font-medium">Mark Attendance</button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FaRocket className="text-pink-500" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to={'/teacher-dashboard/materials'}>
              <button className=" w-full p-4 bg-blue-50 rounded-lg flex flex-col items-center hover:shadow">
                <FaUpload className="text-blue-600 text-2xl mb-2" />
                Upload Material
              </button>
            </Link>

            <Link to={'/teacher-dashboard/attendance'}>
              <button className="p-4 w-full bg-green-50 rounded-lg flex flex-col items-center hover:shadow">
                <FaCheckSquare className="text-green-600 text-2xl mb-2 " />
                Take Attendance
              </button>
            </Link>

            <Link to={'/teacher-dashboard/grades'}>
              <button className="p-4 w-full bg-purple-50 rounded-lg flex flex-col items-center hover:shadow">
                <FaFileAlt className="text-purple-600 text-2xl mb-2" />
                Enter Grades
              </button>
            </Link>

            <Link to={'/teacher-dashboard/attendance/notices'}>
              <button className="p-4 w-full bg-orange-50 rounded-lg flex flex-col items-center hover:shadow">
                <FaBullhorn className="text-red-500 text-2xl mb-2" />
                Send Notice
              </button>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;
