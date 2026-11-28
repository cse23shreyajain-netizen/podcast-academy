import { apiRequest } from "./api";

export const enrollInCourse = (courseId) =>
  apiRequest("/enrollments", { method: "POST", body: JSON.stringify({ courseId }) });

export const getMyEnrollments = () => apiRequest("/enrollments/my");

export const updateProgress = (id, progress) =>
  apiRequest(`/enrollments/${id}/progress`, {
    method: "PATCH",
    body: JSON.stringify({ progress }),
  });

export const getLearningContent = (enrollmentId) =>
  apiRequest(`/enrollments/${enrollmentId}/learning`);

export const completeLesson = (enrollmentId, lessonId) =>
  apiRequest(`/enrollments/${enrollmentId}/lessons/${lessonId}/complete`, { method: "POST" });

export const submitAssessment = (enrollmentId, assessmentId, answers) =>
  apiRequest(`/enrollments/${enrollmentId}/assessments/${assessmentId}`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });

export const submitProject = (enrollmentId, body) =>
  apiRequest(`/enrollments/${enrollmentId}/project`, {
    method: "PUT",
    body: JSON.stringify(body),
  });