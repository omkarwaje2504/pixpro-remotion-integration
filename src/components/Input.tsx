"use client";

import React from "react";

function Input({ label, placeholder }: { label: string; placeholder: string }) {
  console.log("Label:", label, "Placeholder:", placeholder);

  return (
    <div className="bg-white flex flex-col space-y-2">
      <label className="text-black">{label}</label>
      <input placeholder={placeholder} className="bg-white border p-2" />
    </div>
  );
}

export default Input;
