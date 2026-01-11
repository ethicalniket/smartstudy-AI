import axios from "axios";

const API_BASE = "http://localhost:8080/api";

/* ---------------- PUBLIC AXIOS ---------------- */
export const axiosInstance = axios.create({
  baseURL: API_BASE,
});

/* ---------------- AUTH AXIOS (JWT) ---------------- */
export const authAxios = axios.create({
  baseURL: API_BASE,
});

authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------------- AUTH FUNCTIONS ---------------- */
export const login = async (email, password) => {
  const res = await axiosInstance.post("/auth/login", {
    email,
    password,
  });
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const register = async (name, email, password) => {
  return axiosInstance.post("/auth/register", {
    name,
    email,
    password,
  });
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};