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

  if (!response) {
    return { valid: false };
  }
  return response.data;
};

export const sendEmail = async (
  token,
  send_to,
  sent_from,
  reply_to,
  subject,
  body
) => {
  const user = await getUser(token);
  const recipient = await getUser(token, send_to);

  const response = await API.post("api/emails/sendEmail", {
    sender: user,
    email: {
      send_to,
      sent_from,
      reply_to,
      subject,
      body,
    },
    recipient,
  });
  return response.data;
};

export const translate = async (
  text,
  sourceLanguageCode,
  targetLanguageCode="en"
) => {
  const response = await API.post("api/translate", {
    text,
    sourceLanguageCode,
    targetLanguageCode,
  });
  return response.data;
};

// ========= API GETS =========
export const getUser = async (token, userEmail = null, userID = null) => {
  const validToken = await checkToken(token);

  if (!validToken.valid) {
    return null;
  }

  const params = new URLSearchParams();
  if (userEmail) {
    params.append("email", userEmail);
  } else if (userID) {
    params.append("userID", userID);
  } else {
    // Get current user logged in (me)
    params.append("userID", validToken.user.id);
  }

  const response = await API.get("api/users/getUser?" + params.toString());
  return response.data;
};

export const getAllUsers = async () => {
  const validToken = await checkToken();

  if (validToken.valid) {
    const response = await API.get("api/users/getAllUsers");
    return response.data;
  }

  return null;
};

export const getEmails = async (userID) => {
  const params = new URLSearchParams({ userID });
  const emailResponse = await API.get(
    "api/emails/getEmails?" + params.toString()
  );

  return emailResponse.data;
};

export const getAllEmails = async () => {
  const response = await API.get("api/emails/getAllEmails");
  return response.data;
};

// ========= API PUTS =========
// this deleteEmail deletes an email from all folders and moves it to the trash folder
export const deleteEmail = async (token, emailID) => {
  const response = await API.put("api/emails/deleteEmail", {
    token,
    emailID,
  });
  return response.data;
};

export const addFolder = async (userID, folderName) => {
  const response = await API.put("api/users/addFolder", {
    userID,
    folderName,
  });
  return response.data;
};

export const deleteFolder = async (userID, folderName) => {
  const response = await API.put("api/users/deleteFolder", {
    userID,
    folderName,
  });
  return response.data;
};

export const renameFolder = async (userID, oldFolderName, newFolderName) => {
  const response = await API.put("api/users/renameFolder", {
    userID,
    oldFolderName,
    newFolderName,
  });
  return response.data;
};

export const updateLanguage = async (userID, language) => {
  const response = await API.put("api/users/updateLanguage", {
    userID,
    language,
  });
  return response.data;
};

// ========= API DELETES =========
export const permanentDeleteEmail = async (token, emailID) => {
  const response = await API.delete("api/emails/permanentDeleteEmail", {
    token,
    emailID,
  });
  return response.data;
};
