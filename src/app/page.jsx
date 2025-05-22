"use client";

import { useState, useEffect } from "react";
import Banner from "@components/Banner";
import LoadingPage from "@components/LoadingPage";
import LoginForm from "./LoginForm";
import config from "@utils/Config";

// Main Login Component
export default function Home({ project }) {
  const [loading, setLoading] = useState(true);
  const [loginType, setLoginType] = useState("code");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return <LoadingPage label="Play your ads in PVR cinemas" />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
      <Banner />
      <div className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg bg-gray-800 border border-gray-700">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-red-500 mb-2">
              {config().loginPage.heading}
            </h2>
            <p className={`text-gray-300`}>{config().loginPage.subHeading}</p>
          </div>

          <LoginForm loginType={loginType} />
        </div>
      </div>
    </div>
  );
}
