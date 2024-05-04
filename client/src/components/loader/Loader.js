import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-container bg-gradient-to-b from-yahoo-purple to-white h-screen w-full">
      <section className="dots-container">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </section>
    </div>
  );
};

export default Loader;
