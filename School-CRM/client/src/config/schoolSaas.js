import api from "./api";

const normalizePayload = (payload) => {
  const nextPayload = { ...payload };
  if (nextPayload.school === "") {
    delete nextPayload.school;
  }
  return nextPayload;
};

export const listTenants = async () => {
  const response = await api.get("/api/tenants/");
  return response.data;
};

export const createTenant = async (payload) => {
  const response = await api.post("/api/tenants/", payload);
  return response.data;
};

export const activateTenant = async (tenantId, isActive) => {
  const response = await api.post(`/api/tenants/${tenantId}/activate/`, {
    is_active: isActive,
  });
  return response.data;
};

export const deleteTenant = async (tenantId, confirmation) => {
  const response = await api.delete(`/api/tenants/${tenantId}/delete/`, {
    data: { confirmation },
  });
  return response.data;
};

export const listStudents = async () => {
  const response = await api.get("/api/students/");
  return response.data;
};

export const createStudent = async (payload) => {
  const response = await api.post("/api/students/", normalizePayload(payload));
  return response.data;
};

export const updateStudent = async (id, payload) => {
  const response = await api.put(`/api/students/${id}/`, normalizePayload(payload));
  return response.data;
};

export const deleteStudent = async (id) => {
  await api.delete(`/api/students/${id}/`);
};

export const listTeachers = async () => {
  const response = await api.get("/api/teachers/");
  return response.data;
};

export const createTeacher = async (payload) => {
  const response = await api.post("/api/teachers/", normalizePayload(payload));
  return response.data;
};

export const updateTeacher = async (id, payload) => {
  const response = await api.put(`/api/teachers/${id}/`, normalizePayload(payload));
  return response.data;
};

export const deleteTeacher = async (id) => {
  await api.delete(`/api/teachers/${id}/`);
};

export const listTimetableEntries = async () => {
  const response = await api.get("/api/timetable/");
  return response.data;
};

export const createTimetableEntry = async (payload) => {
  const response = await api.post("/api/timetable/", payload);
  return response.data;
};

export const updateTimetableEntry = async (id, payload) => {
  const response = await api.put(`/api/timetable/${id}/`, payload);
  return response.data;
};

export const deleteTimetableEntry = async (id) => {
  await api.delete(`/api/timetable/${id}/`);
};

// Academics API
export const listSubjects = async () => {
  const response = await api.get("/api/academics/subjects/");
  return response.data;
};

export const createSubject = async (payload) => {
  const response = await api.post("/api/academics/subjects/", payload);
  return response.data;
};

export const updateSubject = async (id, payload) => {
  const response = await api.put(`/api/academics/subjects/${id}/`, payload);
  return response.data;
};

export const deleteSubject = async (id) => {
  await api.delete(`/api/academics/subjects/${id}/`);
};

export const listGrades = async () => {
  const response = await api.get("/api/academics/grades/");
  return response.data;
};

export const createGrade = async (payload) => {
  const response = await api.post("/api/academics/grades/", payload);
  return response.data;
};

export const updateGrade = async (id, payload) => {
  const response = await api.put(`/api/academics/grades/${id}/`, payload);
  return response.data;
};

export const deleteGrade = async (id) => {
  await api.delete(`/api/academics/grades/${id}/`);
};

export const listReportCards = async () => {
  const response = await api.get("/api/academics/report-cards/");
  return response.data;
};

export const generateReportCard = async (payload) => {
  const response = await api.post("/api/academics/report-cards/generate/", payload);
  return response.data;
};

export const listAnswerSheets = async () => {
  const response = await api.get("/api/academics/answer-sheets/");
  return response.data;
};

export const createAnswerSheet = async (payload) => {
  const formData = new FormData();
  Object.keys(payload).forEach((key) => {
    formData.append(key, payload[key]);
  });
  const response = await api.post("/api/academics/answer-sheets/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteAnswerSheet = async (id) => {
  await api.delete(`/api/academics/answer-sheets/${id}/`);
};

export const listScholarshipExams = async () => {
  const response = await api.get("/api/academics/scholarship-exams/");
  return response.data;
};

export const createScholarshipExam = async (payload) => {
  const response = await api.post("/api/academics/scholarship-exams/", payload);
  return response.data;
};

export const updateScholarshipExam = async (id, payload) => {
  const response = await api.put(`/api/academics/scholarship-exams/${id}/`, payload);
  return response.data;
};

export const deleteScholarshipExam = async (id) => {
  await api.delete(`/api/academics/scholarship-exams/${id}/`);
};

export const listExamParticipations = async () => {
  const response = await api.get("/api/academics/exam-participations/");
  return response.data;
};

export const createExamParticipation = async (payload) => {
  const response = await api.post("/api/academics/exam-participations/", payload);
  return response.data;
};

export const listExamResults = async () => {
  const response = await api.get("/api/academics/exam-results/");
  return response.data;
};

export const createExamResult = async (payload) => {
  const response = await api.post("/api/academics/exam-results/", payload);
  return response.data;
};

export const updateExamResult = async (id, payload) => {
  const response = await api.put(`/api/academics/exam-results/${id}/`, payload);
  return response.data;
};

export const getStudentGrades = async (studentId) => {
  const response = await api.get(`/api/academics/students/${studentId}/grades/`);
  return response.data;
};

export const getStudentReportCards = async (studentId) => {
  const response = await api.get(`/api/academics/students/${studentId}/report-cards/`);
  return response.data;
};

// Analytics API
export const getClassPerformance = async (params) => {
  const response = await api.get("/api/academics/class-performance/", { params });
  return response.data;
};

export const getSchoolPerformance = async (params) => {
  const response = await api.get("/api/academics/school-performance/", { params });
  return response.data;
};

export const calculateSchoolMetrics = async (payload) => {
  const response = await api.post("/api/academics/calculate-school-metrics/", payload);
  return response.data;
};

// HQ Notices API
export const listNotices = async () => {
  const response = await api.get("/api/academics/notices/");
  return response.data;
};

export const createNotice = async (payload) => {
  const response = await api.post("/api/academics/notices/", payload);
  return response.data;
};

export const updateNotice = async (id, payload) => {
  const response = await api.put(`/api/academics/notices/${id}/`, payload);
  return response.data;
};

export const deleteNotice = async (id) => {
  await api.delete(`/api/academics/notices/${id}/`);
};

export const acknowledgeNotice = async (noticeId, payload) => {
  const response = await api.post(`/api/academics/notices/${noticeId}/acknowledge/`, payload);
  return response.data;
};
