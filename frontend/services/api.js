const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Cannot reach server. Is the backend running?");
  }

  let data = {};
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.status = res.status;
    error.errors = data.errors || [];
    throw error;
  }
  return data;
}