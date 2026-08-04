import React from "react";
import { FaBus, FaClock, FaTachometerAlt, FaMapMarkerAlt } from "react-icons/fa";

const BusTracking = () => {
  const StatCard = ({ title, value, color, icon: Icon }) => (
    <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
      <Icon className={`text-3xl mb-2 ${color}`} />
      <h3 className="text-sm text-gray-600">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className=" lg:w-10/12 m-auto">
      {/* Bus Tracking */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          🚌 Bus Tracking
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Bus #12" value="On Route" color="text-green-600" icon={FaBus} />
          <StatCard title="ETA" value="15 mins" color="text-blue-600" icon={FaClock} />
          <StatCard title="Speed" value="35 km/h" color="text-purple-600" icon={FaTachometerAlt} />
        </div>

        {/* Location Info */}
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="flex items-center justify-center gap-2 text-gray-700">
            <FaMapMarkerAlt className="text-red-500" /> Current Location: Main Street & 5th Ave
          </p>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
            View Live Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusTracking;
