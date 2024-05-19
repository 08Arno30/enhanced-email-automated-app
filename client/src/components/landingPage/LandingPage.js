import { React, useState, useEffect } from "react";
import * as API from "../../api/index";
import { useGoogleLogin } from "@react-oauth/google";
import googleIcon from "../../assets/google-icon-logo-svgrepo-com.svg";
import "./LandingPage.css";
import Loader from "../loader/Loader";
import Cookies from "js-cookie";
const LandingPage = () => {
  // eslint-disable-next-line no-unused-vars
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const showLoader = (time, redirect = false) => {
    setTimeout(() => {
      setIsLoading(false);
    }, time);

    if (redirect) {
      setTimeout(() => {
        window.location = "#/inbox";
      }, 950);
    }
  };

  // test if user is already logged in
  useEffect(() => {
    if (Cookies.get("jwt")) {
      // check if token is still valid
      const checkToken = async () => {
        const response = await API.checkToken(Cookies.get("jwt"));
        if (response.valid) {
          setIsLoggedIn(true);
          showLoader(2000, true);
        } else {
          setIsLoggedIn(false);
        }
      };

      checkToken();
    }
    else {
      Cookies.remove("jwt");
      Cookies.remove("user_id");
    }

    showLoader(1000);
  }, []);

  const handleSuccessfulLogin = (tokenResponse) => {
    setIsLoggedIn(true);
    // store user info in local storage
    localStorage.setItem("user", JSON.stringify(tokenResponse));

    // set time to 1 day before removing user info
    const oneDay = 24 * 60 * 60 * 1000;
    const expirationDate = new Date().getTime() + oneDay;
    localStorage.setItem("expirationDate", expirationDate);

    // redirect to inbox with hashrouter
    window.location.href = "#/inbox";
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const request = async () => {
        try {
          const response = await API.signInGoogle(tokenResponse.access_token);
          if (response) {
            handleSuccessfulLogin(tokenResponse);

            const now = new Date();

            // Save token as cookie
            Cookies.set("jwt", response["token"], {
              expires: now.setDate(now.getDate() + 1),
            });
          }
        } catch (error) {
          console.log(error);
        }
      };

      request();
    },
    onError: (error) => {
      console.log("Login Failed:", error);
    },
  });

  //   useEffect(() => {
  //     if (isLoggedIn) {
  //       handleSuccessfulLogout();
  //     }
  //   })

  return (
    <div>
      {isLoading ? (
        <Loader setIsLoading={setIsLoading} />
      ) : (
        <div className="bg-gradient-to-b from-yahoo-purple to-white h-screen w-full">
          <div className="flex justify-center items-center h-full">
            <div className="bg-yahoo-white rounded-2xl shadow-2xl p-5 w-1/3 signin-card">
              <div className="flex flex-col items-center">
                <h1>
                  <span className="text-4xl font-bold text-yahoo-purple">
                    yahoo
                    <span className="text-yahoo-purple italic">!</span>
                    <span className="text-yahoo-grey"> mail</span>
                  </span>
                </h1>
                <h2 className="text-2xl font-bold mt-10">Sign in</h2>
                <div id="signInButton" className="py-2 px-4 rounded-full mt-10">
                  <button
                    className="py-2 px-4 rounded-md mt-2 border-2 shadow-sm hover:shadow-inner"
                    onClick={login}
                  >
                    <span className="flex items-center">
                      <img
                        className="google-icon w-7 mr-3"
                        src={googleIcon}
                        alt="google icon"
                      />
                      <span className="ml-2">Sign in with Google</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
