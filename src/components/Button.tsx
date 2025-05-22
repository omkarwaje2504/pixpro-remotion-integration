import React, { ReactNode } from "react";
import { FaSpinner } from "react-icons/fa";
import config from "@utils/Config";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  isLoading = false,
  disabled = false,
  type = "button",
  fullWidth = true,
  leftIcon,
}) => {
  const baseClasses =
    "group relative flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition";

  const buttonColor =
    isLoading || disabled
      ? "bg-gray-400 cursor-not-allowed"
      : `${config().theme.selectedBg} ${config().theme.selectedText} `;

  const finalClass = `${baseClasses} ${buttonColor} ${
    fullWidth ? "w-full" : ""
  } focus:ring-red-500`;

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={isLoading || disabled}
      className={finalClass}
    >
      {leftIcon && (
        <span className="  inset-y-0 flex items-center pr-3">
          {isLoading ? (
            <FaSpinner className="animate-spin text-white" />
          ) : (
            leftIcon
          )}
        </span>
      )}
      {isLoading ? "Please wait..." : children}
    </button>
  );
};

export default Button;
