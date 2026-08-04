import React from "react";
import { FaEnvelope, FaBullhorn, FaChalkboardTeacher, FaCalendarAlt, FaUserTie, FaBus } from "react-icons/fa";

const Communication = () => {
  const StatCard = ({ title, value, color, icon: Icon }) => (
    <div
      className={`flex flex-col items-center justify-center bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition`}
    >
      <Icon className={`text-3xl mb-2 ${color}`} />
      <h3 className="text-sm text-gray-600">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className=" lg:w-10/12 m-auto">
      {/* Communications */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          💬 Communications
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <StatCard title="Unread Messages" value="5" color="text-blue-600" icon={FaEnvelope} />
          <StatCard title="School Announcements" value="12" color="text-green-600" icon={FaBullhorn} />
          <StatCard title="Teacher Messages" value="3" color="text-purple-600" icon={FaChalkboardTeacher} />
        </div>

        {/* Updates */}
        <div className="divide-y">
          <div className="py-3 hover:bg-gray-50 rounded-lg px-2 transition cursor-pointer">
            <p className="font-semibold flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" /> Parent-Teacher Meeting
            </p>
            <p className="text-gray-600 text-sm">
              Scheduled for Friday, Jan 19 at 3:00 PM.
            </p>
          </div>

          <div className="py-3 hover:bg-gray-50 rounded-lg px-2 transition cursor-pointer">
            <p className="font-semibold flex items-center gap-2">
              <FaUserTie className="text-purple-500" /> Message from Ms. Wilson
            </p>
            <p className="text-gray-600 text-sm">
              Alice has shown excellent improvement in math this semester.
            </p>
          </div>

          <div className="py-3 hover:bg-gray-50 rounded-lg px-2 transition cursor-pointer">
            <p className="font-semibold flex items-center gap-2">
              <FaBus className="text-yellow-500" /> Bus Route Change
            </p>
            <p className="text-gray-600 text-sm">
              Bus #12 will have a temporary change starting Monday. New pickup:
              7:50 AM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communication;
