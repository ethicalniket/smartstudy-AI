import axios from "axios";

const api = axios.create({

  baseURL:
    process.env.REACT_APP_API

});

api.interceptors.response.use(

  (response) => response,

  (error) => {

    // TOKEN EXPIRED

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

export default api;