import React from "react";
import { Link } from "react-router-dom";

const MenuItem = ({ icon, label, path, active }) => (
  <Link
    to={path}  // ✅ not href
    className={`flex items-center my-2 gap-2 px-4 py-2 rounded-md text-sm ${
      active ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);
export default MenuItem;