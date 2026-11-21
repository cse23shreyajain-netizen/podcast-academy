import { apiRequest } from "./api";

export const updateProfile = (name) =>
  apiRequest("/users/me", { method: "PATCH", body: JSON.stringify({ name }) });

export const changePassword = (body) =>
  apiRequest("/users/me/password", { method: "PATCH", body: JSON.stringify(body) });