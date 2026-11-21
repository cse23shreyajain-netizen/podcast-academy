import { apiRequest } from "./api";

export const getCourses = (params = {}) => {
  const clean = Object.entries(params).filter(([, v]) => v !== "" && v != null);
  const qs = new URLSearchParams(clean).toString();
  return apiRequest(`/courses${qs ? `?${qs}` : ""}`);
};

export const getCourseBySlug = (slug) => apiRequest(`/courses/${slug}`);

export const getCategories = () => apiRequest("/categories");