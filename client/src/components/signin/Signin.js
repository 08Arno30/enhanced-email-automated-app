import React from "react";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Signin = ({ onSuccessfulLogin } ) => {
  return (
    <div className="bg-gradient-to-b from-yahoo-purple to-white h-screen w-full">
      <div className="flex justify-center items-center h-full">
        <div className="bg-white rounded-2xl shadow-2xl p-5 w-1/3">
          <div className="flex flex-col items-center">
            <h1>
              <span className="text-4xl font-bold text-yahoo-purple">
                yahoo<span className="text-yahoo-purple italic">!</span>
              </span>
            </h1>
            <h2 className="text-2xl font-bold mt-10">Sign in</h2>
            <h3 className="text-lg  mt-10">Continue with Google</h3>
            <div id="signInButton" className="py-2 px-4 rounded-full mt-2">
              <GoogleLogin
                clientId={clientId}
                onSuccess={(credentialResponse) => {
                  const decoded = jwtDecode(credentialResponse.credential);
                  console.log(decoded);
                  onSuccessfulLogin(decoded);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
