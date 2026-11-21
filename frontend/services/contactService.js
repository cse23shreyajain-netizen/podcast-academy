import { apiRequest } from "./api";

export const submitContact = (body) =>
  apiRequest("/contact", { method: "POST", body: JSON.stringify(body) });