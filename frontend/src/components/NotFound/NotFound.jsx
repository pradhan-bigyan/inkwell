import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import NotFoundImg from "../../assets/notFound.svg";

const NotFound = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleRedirect = () => {
    if (token) {
      navigate("/notes");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-20 px-4">
        <img src={NotFoundImg} alt="Page not found" className="w-60" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Lost in Your Notes?
        </h1>
        <p className="text-gray-600 mb-2 text-center max-w-2xl">
          Looks like you've wandered off to a page that doesn't exist in your
          note-taking journey.
        </p>
        <p className="text-gray-600 mb-8 text-center">
          Let's get you back on track.
        </p>
        <button
          className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          onClick={handleRedirect}
        >
          {token ? "Go to Notes" : "Go to Login"}
        </button>
        {!token && (
          <p className="mt-6 text-gray-500 text-center">
            Don't have an account?{" "}
            <button
              className="text-primary hover:text-secondary font-medium underline"
              onClick={() => navigate("/signup")}
            >
              Sign up here
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default NotFound;
