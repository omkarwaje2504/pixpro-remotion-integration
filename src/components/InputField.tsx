import React, { useEffect, useState, ChangeEvent, ReactNode } from "react";
import config from "@utils/Config";

type ValidationRule = {
  regex?: RegExp;
  message?: string;
  trim?: boolean;
  maxLength?: number;
};

type Option = {
  label: string;
  value: string;
};

type InputFieldProps = {
  id: string;
  label: string;
  icon?: ReactNode;
  type?: React.HTMLInputTypeAttribute | "select" | "radio";
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  validation?: ValidationRule;
  placeholder?: string;
  autoFocus?: boolean;
  required?: boolean;
  disabled?: boolean;
  customError?: string;
  showCharCount?: boolean;
  maxLength?: number;
  options?: Option[]; // For select and radio
  name?: string; // For radio group
};

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  icon,
  type = "text",
  value,
  onChange,
  validation = {},
  placeholder = "",
  autoFocus = false,
  required = false,
  disabled = false,
  customError = "",
  showCharCount = false,
  maxLength,
  options = [],
  name,
}) => {
  const [error, setError] = useState<string>("");
  useEffect(() => {
    if (validation.regex && value) {
      const isValid = validation.regex.test(value);
      if (!isValid) {
        setError(validation.message || "Invalid input format.");
      } else {
        setError("");
      }
    } else if (!value && required) {
      setError("This field is required.");
    } else {
      setError("");
    }
  }, [value, validation, required]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    let val = e.target.value;

    if ("type" in e.target && e.target.type !== "radio" && validation.trim) {
      val = val.trimStart();
    }

    if (validation.maxLength && val.length > validation.maxLength) {
      return;
    }

    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: val,
      },
    };

    onChange(
      syntheticEvent as ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    );
  };
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1 text-gray-300"
      >
        {label}
      </label>

      {type === "select" ? (
        <select
          id={id}
          name={id}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="bg-gray-700 text-white block w-full rounded-md border-0 py-2 px-3 ring-1 ring-inset ring-gray-600 focus:ring-red-500 focus:outline-none"
        >
          <option value="" disabled>
            -- Select --
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "radio" ? (
        <div className="flex flex-wrap">
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-4 mr-2 py-2 rounded-lg border cursor-pointer transition-all
              ${
                isSelected
                  ? `${config().theme.selectedGradient} ${config().theme.selectedText}`
                  : `${config().theme.unselectedBorder} ${config().theme.unselectedText}`
              }`}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  onChange={handleChange}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${isSelected ? config().theme.dotBorder + " bg-white" : config().theme.unselectedBorder}`}
                >
                  {isSelected && (
                    <div
                      className={`w-2.5 h-2.5 ${config().theme.selectedDot} rounded-full`}
                    />
                  )}
                </div>
                <span className="font-medium">{option.label}</span>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            required={required}
            maxLength={maxLength}
            className={`bg-gray-700 text-white ${
              icon ? "pl-10" : "px-3"
            } block w-full rounded-md border-0 py-2 ring-1 ring-inset ${
              error || customError
                ? "ring-red-500 focus:ring-red-500"
                : "ring-gray-600 focus:ring-red-500"
            } focus:ring-2`}
          />
        </div>
      )}
      {showCharCount && maxLength !== undefined && (
        <p className="text-xs text-gray-400 text-right mt-1">
          {value.length}/{maxLength}
        </p>
      )}

      {(error || customError) && (
        <p className="mt-1 text-sm text-red-500">{customError || error}</p>
      )}
    </div>
  );
};

export default InputField;
