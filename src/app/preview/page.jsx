"use client";
import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";

export default function PreviewPage() {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("name") || "Your Name");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <h1 className="text-2xl font-semibold mb-6 text-white">
        Preview for {name}
      </h1>
      <VideoPlayer name={name} />
    </div>
  );
}
