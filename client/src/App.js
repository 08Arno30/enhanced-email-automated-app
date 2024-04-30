import React from "react";
import "./App.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// components
import AppRoutes from "./AppRoutes";
import { HashRouter } from "react-router-dom";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <HashRouter basename="/landing-page">
        <AppRoutes />
      </HashRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
