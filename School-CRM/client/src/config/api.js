import axios from "axios";
import store from "../redux/store"; // import your Redux store
import { logout } from "../redux/authSlice";

const baseURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState(); // access Redux state directly
    const token = state.auth.token; // adjust path if different (authSlice)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
