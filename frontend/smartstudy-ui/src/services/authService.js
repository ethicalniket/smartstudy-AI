import axios from "axios";

// =========================
// API BASE URL
// =========================

const API_BASE =

  process.env.REACT_APP_API;

// =========================
// PUBLIC AXIOS
// =========================

export const axiosInstance =

  axios.create({

    baseURL: API_BASE

  });

// =========================
// AUTH AXIOS
// =========================

export const authAxios =

  axios.create({

    baseURL: API_BASE

  });

// =========================
// REQUEST INTERCEPTOR
// =========================

authAxios.interceptors.request.use(

  (config) => {

    const token =

      localStorage.getItem(
        "token"
      );

    if (token) {

      config.headers.Authorization =

        `Bearer ${token}`;

    }

    return config;

  }

);

// =========================
// RESPONSE INTERCEPTOR
// =========================

authAxios.interceptors.response.use(

  (response) => response,

  (error) => {

    if (

      error.response?.status === 401

    ) {

      localStorage.removeItem(
        "token"
      );

      window.location.href =
        "/login";

    }

    return Promise.reject(
      error
    );

  }

);

// =========================
// LOGIN
// =========================

export const login =

  async (

    email,
    password

  ) => {

    const res =

      await axiosInstance.post(

        "/auth/login",

        {
          email,
          password
        }

      );

    localStorage.setItem(

      "token",

      res.data.token

    );

    return res.data;

  };

// =========================
// REGISTER
// =========================

export const register =

  async (

    name,
    email,
    password

  ) => {

    return axiosInstance.post(

      "/auth/register",

      {
        name,
        email,
        password
      }

    );

  };

// =========================
// LOGOUT
// =========================

export const logout = () => {

  localStorage.removeItem(
    "token"
  );

  window.location.href =
    "/login";

};

// =========================
// TOKEN
// =========================

export const getToken = () => {

  return localStorage.getItem(
    "token"
  );

};