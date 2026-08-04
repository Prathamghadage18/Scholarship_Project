const ROLE_DASHBOARD_PATHS = {
  HQ: "/admin-dashboard",
  PRINCIPAL: "/principal-dashboard",
  TEACHER: "/teacher-dashboard",
  STUDENT: "/student-dashboard",
  PARENT: "/parent-dashboard",
};

export const normalizeRole = (role) => {
  if (!role) return null;
  const normalized = String(role).trim().toUpperCase();
  return normalized === "PRINCIPLE" ? "PRINCIPAL" : normalized;
};

export const getDashboardPath = (role) => {
  const normalizedRole = normalizeRole(role);
  return ROLE_DASHBOARD_PATHS[normalizedRole] || "/login";
};
