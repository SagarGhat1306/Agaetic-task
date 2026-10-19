// axios setup. adds the token to every request and refreshes it once if we get a 401
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL, withCredentials: true });

let accessToken = null;
let refreshPromise = null;
let onSessionExpired = () => {};

export function setAccessToken(token) {
  accessToken = token;
}

export function setSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

export function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${baseURL}/auth/refresh`, null, { withCredentials: true })
      .then((response) => {
        accessToken = response.data.accessToken;
        return response.data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const isAuthCall = request?.url?.startsWith("/auth/");

    if (error.response?.status === 401 && request && !request._retried && !isAuthCall) {
      request._retried = true;
      try {
        await refreshAccessToken();
        return api(request);
      } catch {
        accessToken = null;
        onSessionExpired();
      }
    }

    return Promise.reject(error);
  }
);

export function getErrorMessage(error) {
  if (!error.response) {
    return "Could not reach the server. Is the backend running?";
  }
  return error.response.data?.message || "Something went wrong";
}

export default api;
