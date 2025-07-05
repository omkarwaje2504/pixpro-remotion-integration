"use client";

import React, {
  useEffect,
  useState,
  ChangeEvent,
  ReactNode,
  useRef,
} from "react";
import config from "@utils/Config";
import inputStyles from "styles/inputStyles";

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
  type?: React.HTMLInputTypeAttribute | "select" | "radio" | "textarea";
  value: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
  validation?: ValidationRule;
  placeholder?: string;
  autoFocus?: boolean;
  required?: boolean;
  disabled?: boolean;
  customError?: string;
  showCharCount?: boolean;
  maxLength?: number;
  options?: Option[];
  name?: string;
  onValidationChange?: (isValid: boolean) => void;
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
  onValidationChange,
}) => {
  const [error, setError] = useState<string>("");
  const onValidationChangeRef = useRef(onValidationChange);

  // Keep the latest function
  useEffect(() => {
    onValidationChangeRef.current = onValidationChange;
  }, [onValidationChange]);

  useEffect(() => {
    let isValid = true;

    if (required && !value.trim()) {
      setError("This field is required.");
      isValid = false;
    } else if (validation.regex && value && !validation.regex.test(value)) {
      setError(validation.message || "Invalid input format.");
      isValid = false;
    } else {
      setError("");
    }

    onValidationChangeRef.current?.(isValid);
  }, [value, required, validation]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    let val = e.target.value;

    if (validation.trim && type !== "radio") {
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

    onChange(syntheticEvent);
  };

  const errorMessage = customError || error;

  return (
    <div className="mb-4">
      <label htmlFor={id} className={inputStyles.label}>
        {required && <span className="text-red-500">*</span>} {label}
      </label>

      {type === "select" ? (
        <select
          id={id}
          name={name || id}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          aria-invalid={!!errorMessage}
          className={`${inputStyles.selectBase} ${
            errorMessage
              ? inputStyles.selectErrorRing
              : inputStyles.selectDefaultRing
          }`}
        >
          <option value="" disabled hidden>
            {placeholder || "-- Select --"}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          name={name || id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          required={required}
          maxLength={maxLength}
          aria-invalid={!!errorMessage}
          className={`${inputStyles.textareaBase} ${
            icon ? inputStyles.inputWithIcon : inputStyles.inputNoIcon
          } ${errorMessage ? inputStyles.ringError : inputStyles.ringDefault}`}
        />
      ) : type === "radio" ? (
        <div className={inputStyles.radioGroup}>
          {options.map((option) => {
            const isSelected = value === option.value;
            const theme = config().theme;

            return (
              <label
                key={option.value}
                className={`${inputStyles.radioLabelBase} ${
                  isSelected
                    ? `${theme.selectedGradient} ${theme.selectedText}`
                    : `${theme.unselectedBorder} ${theme.unselectedText}`
                }`}
              >
                <input
                  type="radio"
                  name={name || id}
                  value={option.value}
                  checked={isSelected}
                  onChange={handleChange}
                  className="hidden"
                />
                <div
                  className={`${inputStyles.radioCircle} ${
                    isSelected
                      ? `${theme.dotBorder} bg-white`
                      : theme.unselectedBorder
                  }`}
                >
                  {isSelected && (
                    <div
                      className={`${inputStyles.radioDot} ${theme.selectedDot}`}
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
            name={name || id}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            required={required}
            maxLength={maxLength}
            aria-invalid={!!errorMessage}
            className={`${inputStyles.baseInput} ${
              icon ? inputStyles.inputWithIcon : inputStyles.inputNoIcon
            } ${errorMessage ? inputStyles.ringError : inputStyles.ringDefault}`}
          />
        </div>
      )}

      {showCharCount && maxLength !== undefined && (
        <p className={inputStyles.charCount}>
          {value.length}/{maxLength}
        </p>
      )}

      {errorMessage && <p className={inputStyles.errorText}>{errorMessage}</p>}
    </div>
  );
};

export default InputField;
