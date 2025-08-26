import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary via-background to-secondary text-center px-4">
      {/* Main Heading */}
      <h1 className="text-4xl sm:text-6xl text-shadow-lg lg:text-7xl font-extrabold text-heading drop-shadow-md">
        Welcome to Customer Support
      </h1>

      {/* Subheading */}
      <p className="mt-6 text-base sm:text-xl lg:text-2xl text-gray-900 max-w-2xl font-medium leading-relaxed tracking-wide">
        Transform your customer experience with our AI-powered support system —
        faster, smarter, and built for the future.
      </p>

      {/* Login Button */}
      <button
        onClick={() => navigate("/login")}
        className="mt-8 bg-primary hover:bg-primary-hover cursor-pointer text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all"
      >
        Login
      </button>
    </div>
  );
}
