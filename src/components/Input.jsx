"use client";

import React from "react";

function Input({
  label,
  name,
  placeholder,
  type = "text",         
  required = false,
  options = [],          
  value,
  onChange
}) {
  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <select
            name={name}
            id={name}
            required={required}
            value={value}
            onChange={onChange}
            className="bg-white border p-2"
          >
            <option value="" disabled>
              {placeholder || "Select an option"}
            </option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={name}
              id={name}
              checked={value}
              onChange={onChange}
              className="w-4 h-4"
            />
            <label htmlFor={name} className="text-black">{placeholder}</label>
          </div>
        );

      case "textarea":
        return (
          <textarea
            name={name}
            id={name}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange}
            className="bg-white border p-2"
            rows={4}
          />
        );

      case "date":
      case "number":
      case "email":
      case "password":
      case "text":
      default:
        return (
          <input
            type={type}
            name={name}
            id={name}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange}
            className="border p-2"
          />
        );
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {label && type !== "checkbox" && (
        <label htmlFor={name} className="text-white/65">
          {label}
          {required && <span className="text-red-500"> {" "} * </span>}
        </label>
      )}
      {renderInput()}
    </div>
  );
}

export default Input;
