import { apiRequest } from "./api";

export const enrollInCourse = (courseId) =>
  apiRequest("/enrollments", { method: "POST", body: JSON.stringify({ courseId }) });

export const getMyEnrollments = () => apiRequest("/enrollments/my");

export const updateProgress = (id, progress) =>
  apiRequest(`/enrollments/${id}/progress`, {
    method: "PATCH",
    body: JSON.stringify({ progress }),
  });