import axios from "axios";

// For local development
// const API = axios.create({ baseURL: "http://localhost:5000" });

// For production
const API = axios.create({
  baseURL: "https://enhanced-email-automated-app-backend.onrender.com",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("user_info")) {
    req.headers.Authorization = `Bearer ${JSON.parse(
      localStorage.getItem("user_info").token
    )}`;
  }

  return req;
});

export const signInGoogle = async (accessToken) => {
  const response = await API.post("/users/signin", {
    accessToken
  });
    return response.data;
};

export const checkToken = async (token) => {
  const response = await API.post("/users/checkToken", {
    token
  });
  return response.data;
};