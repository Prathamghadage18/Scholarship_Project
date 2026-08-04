import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUserRole, isAuthenticated } from "../redux/authSlice";
import { normalizeRole } from "./roleUtils";

const ProtectedRoute = ({ allowedRoles = ["HQ", "STUDENT", "TEACHER", "PRINCIPAL", "PARENT"] }) => {
  const userRole = normalizeRole(useSelector(selectCurrentUserRole));
  // console.log(userRole)
  const auth = useSelector(isAuthenticated);
  const location = useLocation();

  // Not logged in at all
  if (!auth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Logged in but not authorized for this route
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;