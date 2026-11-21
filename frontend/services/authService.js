import { apiRequest } from "./api";

export const registerUser = (body) =>
  apiRequest("/auth/register", { method: "POST", body: JSON.stringify(body) });

export const loginUser = (body) =>
  apiRequest("/auth/login", { method: "POST", body: JSON.stringify(body) });

export const logoutUser = () => apiRequest("/auth/logout", { method: "POST" });

export const getMe = () => apiRequest("/auth/me");