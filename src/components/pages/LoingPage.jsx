"use client";

import { useState, useEffect } from "react";
import Banner from "@components/ui/Banner";
import LoadingPage from "@components/ui/LoadingPage";
import LoginForm from "./LoginForm";
import config from "@utils/Config";

export default function LoginPage({ projectData }) {
  const [loading, setLoading] = useState(true);
  const [loginType, setLoginType] = useState("code");
  const ui = config(projectData);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("projectHash", projectData.id);
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <LoadingPage ui={ui} loadingtext="Play your ads in PVR cinemas..." />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Banner />
      <div className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all">
          <div className="text-center">
            <h2
              className={`text-3xl font-extrabold mb-2`}
              style={{
                color: ui.basic.primaryColor,
              }}
            >
              {ui.loginPage.heading}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {ui.loginPage.subHeading}
            </p>
          </div>
          <LoginForm ui={ui} loginType={loginType} />
        </div>
      </div>
    </div>
  );
}
