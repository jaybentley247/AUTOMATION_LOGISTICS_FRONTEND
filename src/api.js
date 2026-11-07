import { ADMIN_AUTH_KEY } from "./adminConfig";

export const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export function getAdminToken() {
  return localStorage.getItem(ADMIN_AUTH_KEY);
}

export function adminAuthHeader() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Wraps fetch for admin-only endpoints: adds the auth header and,
// on a 401, clears the stale session and bounces to the login page.
export async function adminFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...adminAuthHeader(),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    window.location.href = "/admin/login";
  }

  return res;
}
