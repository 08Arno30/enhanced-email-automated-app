import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-container bg-gradient-to-b from-yahoo-purple to-white h-screen w-full">
      <section class="dots-container">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </section>
    </div>
  );
};

export default Loader;
