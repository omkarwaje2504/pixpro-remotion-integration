"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Home = () => {
  const [name, setName] = useState("");
  const router = useRouter();

  const onSubmit = (e) => {
    e.preventDefault();
    if (name) {
      localStorage.setItem("name",name)
      router.push(`/preview`);
    }
  };

  return (
    <div className="bg-white h-screen w-full flex justify-center items-center">
      <div>
        <form onSubmit={onSubmit} className="flex flex-col space-y-5 justify-center items-center">
          <div>
            <label htmlFor="name" className="text-xl font-bold">
              Name :
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="border px-1 ml-2"
            />
          </div>
          <button
            type="submit"
            className="border bg-black text-white px-3 py-1 rounded-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
