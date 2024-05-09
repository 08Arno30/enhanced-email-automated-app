import axios from "axios";

// For local development
const API = axios.create({ baseURL: "http://localhost:5000" });

// For production
// const API = axios.create({
//   baseURL: "https://enhanced-email-automated-app-backend.onrender.com",
// });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("user_info")) {
    req.headers.Authorization = `Bearer ${JSON.parse(
      localStorage.getItem("user_info").token
    )}`;
  }

  return req;
});

// ========= API POSTS =========
export const signInGoogle = async (accessToken) => {
  const response = await API.post("api/users/signin", {
    accessToken,
  });
  return response.data;
};

export const checkToken = async (token) => {
  const response = await API.post("api/users/checkToken", {
    token,
  });
  return response.data;
};

// ========= API GETS =========
export const getUser = async (token) => {
  const validToken = await checkToken(token);

  if (validToken.valid) {
    const email = validToken.user.email;
    const params = new URLSearchParams({ email });
    const response = await API.get("api/users/getUser?" + params.toString());
    return response.data;
  }

  return null;
};

export const getAllUsers = async () => {
  const validToken = await checkToken();

  if (validToken.valid) {
    const response = await API.get("api/users/getAllUsers");
    return response.data;
  }

  return null;
};
