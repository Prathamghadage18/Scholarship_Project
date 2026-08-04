import React from "react";
import { FaBookOpen, FaFlask, FaGlobe, FaClipboardCheck, FaFileAlt, FaClock } from "react-icons/fa";

const Progress = () => {
  const SubjectCard = ({ subject, teacher, grade, percent, icon: Icon }) => (
    <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <Icon className="text-xl text-blue-500" />
        <div>
          <h4 className="font-semibold text-gray-800">{subject}</h4>
          <p className="text-gray-500 text-sm">{teacher}</p>
        </div>
      </div>
      <div className="text-right w-32">
        <span className="text-lg font-bold">{grade}</span>
        <p className="text-sm text-gray-500">{percent}%</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="h-2 rounded-full bg-blue-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );

  const ActivityCard = ({ title, desc, status, icon: Icon }) => {
    const statusStyles = {
      success: "bg-green-50 border-l-4 border-green-500",
      info: "bg-blue-50 border-l-4 border-blue-500",
      warning: "bg-red-50 border-l-4 border-red-500",
    };

    return (
      <div
        className={`p-4 rounded-lg shadow text-sm flex items-start gap-3 hover:bg-gray-50 transition ${statusStyles[status]}`}
      >
        <Icon className="text-lg mt-1" />
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-gray-600">{desc}</p>
        </div>
      </div>
    );
  };

  return (
    <div className=" lg:w-10/12 m-auto">
      {/* Progress Report */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            📚 Subject Performance
          </h2>
          <SubjectCard subject="Mathematics" teacher="Ms. Wilson" grade="A" percent={90} icon={FaBookOpen} />
          <SubjectCard subject="Science" teacher="Mr. Brown" grade="A-" percent={85} icon={FaFlask} />
          <SubjectCard subject="English" teacher="Mrs. Davis" grade="A" percent={88} icon={FaGlobe} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            📝 Recent Activity
          </h2>
          <ActivityCard
            title="Math Quiz Completed"
            desc="Score: 92/100 • Yesterday"
            status="success"
            icon={FaClipboardCheck}
          />
          <ActivityCard
            title="Science Assignment Submitted"
            desc="On time • 2 days ago"
            status="info"
            icon={FaFileAlt}
          />
          <ActivityCard
            title="History Project Due"
            desc="Tomorrow • Not submitted"
            status="warning"
            icon={FaClock}
          />
        </div>
      </div>
    </div>
  );
};

export default Progress;
