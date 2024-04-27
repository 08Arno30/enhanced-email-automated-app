import React from 'react';
import './App.css';
import { GoogleOAuthProvider } from "@react-oauth/google";

// components
import AppRoutes from './AppRoutes';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AppRoutes />
    </GoogleOAuthProvider>
  );
}

export default App;