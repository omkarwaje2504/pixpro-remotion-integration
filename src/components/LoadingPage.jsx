"use client";

import { useEffect, useState } from "react";
import { FaFilm, FaRegPlayCircle } from "react-icons/fa";

const LoadingPage = ({ label }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-black`}
    >
      <div className="relative mb-12">
        <FaFilm className="text-red-500 text-8xl animate-pulse" />
        <FaRegPlayCircle
          className={`text-white text-4xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
        />
      </div>

      <h1 className="text-4xl font-bold text-red-500 mb-2">Bigviz</h1>
      <p className=" text-white mb-8">{label}</p>

      <div className={`w-64 bg-gray-700 rounded-full h-3 mb-4`}>
        <div
          className="bg-red-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className={`text-gray-300`}>Loading assets... {progress}%</p>
    </div>
  );
};

export default LoadingPage;
