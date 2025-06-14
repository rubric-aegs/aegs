// src/pages/LandingPage.js
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import Navbar from "../components/NavBar";
import "../assets/css/LandingPage.css";

export default function LandingPage() {
  useEffect(() => {
          document.title = "Home";
        }, []);
  return (
    <div className="flex flex-col items-center justify-center">
      <Navbar />
      <img src="/img/illus.png" alt="Illustration" className="illus"></img>
      <div className="flex flex-col lg:flex-row items-center px-8 py-20 max-w-6xl mx-auto">
      <div className="lg:w-1/2 mb-10 lg:mb-0 flex justify-center">
      <img 
        src={process.env.PUBLIC_URL + "/img/illus.png"}
        alt="Illustration" 
        className="illus max-w-full h-auto" 
      />
      </div>

      <div className="text-left">
        <h1 className="text-5xl font-bold text-gray-900 AEGS">
          Rubric-Based <br /> Automated Essay <br /> Grading System
        </h1>
        <p className="text-gray-600 mt-6 landing-text">
          An intelligent grading system that evaluates essays based on a structured rubric, 
          ensuring accuracy, consistency, and efficiency in assessment.
        </p>
        <Link to="/grading-form" className="grade-button mt-6 inline-block">
          Grade now!
        </Link>
      </div>
    </div>
    </div>
  );
}