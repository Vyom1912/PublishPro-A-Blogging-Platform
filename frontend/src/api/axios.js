import axios from "axios";

// Central axios instance — all requests go through here.
// `withCredentials: true` is critical: it tells the browser to send
// httpOnly cookies (accessToken, refreshToken) with every request.
// Without this, the backend auth middleware would never see the tokens.
const api = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: import.meta.env.VITE_API_URL,

  withCredentials: true, // IMPORTANT: sends cookies cross-origin
});

// ---------------------------------------------------------------------------
// Response interceptor — silent token refresh
// ---------------------------------------------------------------------------
// When the access token expires (15 min), the server returns 401.
// This interceptor automatically calls /auth/refresh (which uses the
// httpOnly refreshToken cookie), gets a new access token set in a cookie,
// and then retries the original request — completely transparent to the UI.

let isRefreshing = false;
let failedQueue = []; // requests that came in while a refresh is in progress

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  // Any 2xx response passes straight through
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401, and only once per request (_retry flag)
    // Also skip the refresh endpoint itself to avoid infinite loops
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest.url.includes("/auth/login")
    ) {
      if (isRefreshing) {
        // Queue this request until the ongoing refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue(null);
        return api(originalRequest); // retry the original failed request
      } catch (refreshError) {
        // Refresh failed (expired or revoked) — user must log in again
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
