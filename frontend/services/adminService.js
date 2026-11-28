import { apiRequest } from "./api";

const qs = (params = {}) => {
  const clean = Object.entries(params).filter(([, v]) => v !== "" && v != null);
  const s = new URLSearchParams(clean).toString();
  return s ? `?${s}` : "";
};

const send = (method, path, body) =>
  apiRequest(path, { method, ...(body ? { body: JSON.stringify(body) } : {}) });

// Stats
export const getStats = () => apiRequest("/admin/stats");

// Students
export const getStudents = (params) => apiRequest(`/admin/students${qs(params)}`);
export const getStudent = (id) => apiRequest(`/admin/students/${id}`);
export const setUserStatus = (id, status) => send("PATCH", `/admin/users/${id}/status`, { status });

// Enrolments
export const getAdminEnrollments = (params) => apiRequest(`/admin/enrollments${qs(params)}`);

// Courses
export const getAdminCourses = (params) => apiRequest(`/admin/courses${qs(params)}`);
export const getAdminCourse = (id) => apiRequest(`/admin/courses/${id}`);
export const createCourse = (body) => send("POST", "/admin/courses", body);
export const updateCourse = (id, body) => send("PUT", `/admin/courses/${id}`, body);
export const updateCourseContent = (id, body) => send("PUT", `/admin/courses/${id}/content`, body);
export const setCourseStatus = (id, status) => send("PATCH", `/admin/courses/${id}/status`, { status });
export const deleteCourse = (id) => send("DELETE", `/admin/courses/${id}`);

// Categories
export const getAdminCategories = () => apiRequest("/admin/categories");
export const createCategory = (body) => send("POST", "/admin/categories", body);
export const updateCategory = (id, body) => send("PUT", `/admin/categories/${id}`, body);
export const deleteCategory = (id) => send("DELETE", `/admin/categories/${id}`);

// Instructors
export const getInstructors = (params) => apiRequest(`/admin/instructors${qs(params)}`);
export const createInstructor = (body) => send("POST", "/admin/instructors", body);
export const updateInstructor = (id, body) => send("PUT", `/admin/instructors/${id}`, body);