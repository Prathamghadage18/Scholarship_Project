import React, { useState } from "react";
import { FaUser, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const roles = [
  // {
  //   id: "student",
  //   label: "Student",
  //   icon: <FaUser className="text-xl" />,
  //   description: "Access learning resources & explore",
  //   colorClass: "bg-indigo-50",
  // },
  {
    id: "parent",
    label: "Parent",
    icon: <FaUserTie className="text-xl" />,
    description: "Stay updated & manage child progress",
    colorClass: "bg-indigo-50",
  },
  {
    id: "principle",
    label: "Principle",
    icon: <FaUserTie className="text-xl" />,
    description: "Oversee & manage institution",
    colorClass: "bg-indigo-50",
  },
  {
    id: "teacher",
    label: "Teacher",
    icon: <FaUserTie className="text-xl" />,
    description: "Educate & guide students effectively",
    colorClass: "bg-indigo-50",
  },
];

const SignupRoleSelection = ({ onSelect }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = () => {
     localStorage.setItem('role', selectedRole);
    if (selectedRole) {
      navigate(`/${selectedRole+"-dashboard"}`);
      // Store selected role in localStorage
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primaryLight via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-600 dark:to-gray-900">
      <section className="w-full sm:max-w-3xl px-6 sm:px-4">
        {/* Glassmorphism Card */}
        <div className="bg-white dark:bg-gray-600/70 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 backdrop-blur-md">
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-600 dark:text-white mb-2">
              Choose Your Role
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Select your role to begin your journey
            </p>

            {/* Roles Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className="cursor-pointer transform transition hover:scale-[1.02] active:scale-95"
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.id}
                    checked={selectedRole === role.id}
                    onChange={() => {
                      setSelectedRole(role.id);
                      if (onSelect) onSelect(role.id);
                    }}
                    className="hidden"
                  />
                  <div
                    className={`p-5 rounded-xl border transition-all flex items-center gap-4 ${
                      selectedRole === role.id
                        ? `${role.colorClass} shadow-inner border-primary`
                        : "bg-white/40 dark:bg-gray-700/40 border-gray-200 dark:border-gray-600 hover:bg-white/60 dark:hover:bg-gray-700/60"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border ${
                        selectedRole === role.id
                          ? "bg-white text-primary dark:text-emerald-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-white"
                      }`}
                    >
                      {role.icon}
                    </div>

                    {/* Text */}
                    <div className="text-left flex-1">
                      <h3
                        className={`font-semibold text-lg ${
                          selectedRole === role.id
                            ? "text-primary dark:text-emerald-400"
                            : "text-gray-600 dark:text-white"
                        }`}
                      >
                        {role.label}
                      </h3>
                      <p
                        className={`text-sm ${
                          selectedRole === role.id
                            ? "text-gray-700 dark:text-emerald-300/90"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {role.description}
                      </p>
                    </div>

                    {/* Selection Circle */}
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedRole === role.id
                          ? "border-primary dark:border-emerald-400"
                          : "border-gray-300 dark:border-gray-500"
                      }`}
                    >
                      {selectedRole === role.id && (
                        <div className="w-3 h-3 rounded-full bg-primary dark:bg-emerald-400" />
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Continue Button */}
            <button
              disabled={!selectedRole}
              onClick={handleSubmit}
              className={`w-full mt-8 py-3 rounded-lg font-semibold text-lg transition transform ${
                selectedRole
                  ? "bg-primary  text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95"
                  : "bg-gray-200/60 dark:bg-gray-700/60 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignupRoleSelection;
