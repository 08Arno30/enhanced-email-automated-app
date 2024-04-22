import React, { Fragment } from "react";

const Signin = () => {
  return (
    <Fragment>
      <div className="bg-gradient-to-b from-yahoo-purple to-white h-screen w-full">
        <div className="flex justify-center items-center h-full">
          <div className="bg-white rounded-2xl shadow-2xl p-5 w-1/3">
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-bold text-yahoo-purple">
                yahoo<text className="text-yahoo-purple italic">!</text>
              </h1>
                          <h2 className="text-2xl font-bold mt-10">Sign in</h2>
                          <h3 className="text-lg  mt-10">Continue with Google</h3>
              <button className="bg-yahoo-purple text-white py-2 px-4 rounded-full mt-2">
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Signin;
