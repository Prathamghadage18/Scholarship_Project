import api from "./api";

export const getAllStudent = async () => {
  const role = "student";
  try {
    const res = await api.get(`/api/admin/user/${role}`);
    console.log("Fetched students:", res.data.data.length);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};

export const getAllTeacher = async () => {
  const role = "teacher";
  try {
    const res = await api.get(`/api/admin/user/${role}`);
    console.log("Fetched teachers:", res.data.data.length);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return [];
  }
};

export const getAllPrincipal = async () => {
  const role = "principal";
  try {
    const res = await api.get(`/api/admin/user/${role}`);
    console.log("Fetched principals:", res.data.data.length);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching principals:", error);
    return [];
  }
};

export const getAllAdmin = async () => {
  const role = "admin";
  try {
    const res = await api.get(`/api/admin/user/${role}`);
    console.log("Fetched admins:", res.data.data.length);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }
};

// ✅ Aggregate all
export const getAllUser = async () => {
  const [student, teacher, principal] = await Promise.all([
    getAllStudent(),
    getAllTeacher(),
    getAllPrincipal(),
  ]);

  const totalUser = student.length + teacher.length + principal.length;
    console.log("Total users:", totalUser);

  return {
    student,
    teacher,
    principal,
    totalUser,
  };
};

export const getTeacherClass = async () => {
  try {
    const res = await api.get("/api/auth/me");
    console.log("Fetched current teacher class:", res.data.data.user.teacherDetails.classes);
    return res.data.data.user.teacherDetails.classes;
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }
};

export const getTeacherSubject = async () => {
  try {
    const res = await api.get("/api/auth/me");
    console.log("Fetched current Teacher Subject:", res.data.data.user.teacherDetails.subjects);
    return res.data.data.user.teacherDetails.subjects;
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }
};

export const getTeacherUploadedMaterials = async () => {
  try {
    const res = await api.get(`/api/teacher/study-materials`);
    console.log('uploaded materials',res.data)
    return res.data.data;
  } catch (error) {
    console.error("Error fetching materials:", error);
    return [];
  }
};
