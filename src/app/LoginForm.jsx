"use client";

import { useState } from "react";
import InputField from "@components/InputField";
import Button from "@components/Button";
import { FaTicketAlt, FaLock, FaMobileAlt, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

const validations = {
  code: {
    regex: /^[A-Z0-9]{4,10}$/,
    message: "Enter a valid access code (4–10 characters).",
  },
  password: {
    regex: /^.{6,}$/,
    message: "Password must be at least 6 characters.",
  },
  mobile: {
    regex: /^[6-9]\d{9}$/,
    message: "Enter a valid 10-digit mobile number.",
  },
};

const LoginForm = ({ loginType }) => {
  const [formData, setFormData] = useState({
    code: "",
    password: "",
    mobile: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (key) => (e) => {
    const { type, value, files } = e.target;
    const finalValue = type === "file" ? files?.[0]?.name || "" : value;

    setFormData((prev) => ({
      ...prev,
      [key]: finalValue,
    }));
  };

  const handleSubmit = () => {
    console.log("data");
    router.push("/homepage");
  };

  return (
    <div className="mt-8 space-y-6">
      {loginType === "code" && (
        <InputField
          id="code"
          label="Cinema Access Code"
          icon={<FaTicketAlt className="text-gray-400" />}
          type="text"
          value={formData.code}
          onChange={handleChange("code")}
          error={errors.code}
          validation={validations.code}
          required
        />
      )}

      {loginType === "code-password" && (
        <>
          <InputField
            id="code"
            label="Cinema Access Code"
            icon={<FaTicketAlt className="text-gray-400" />}
            type="text"
            value={formData.code}
            onChange={handleChange("code")}
            error={errors.code}
            validation={validations.code}
            required
          />
          <InputField
            id="password"
            label="Password"
            icon={<FaLock className="text-gray-400" />}
            type="password"
            value={formData.password}
            onChange={handleChange("password")}
            error={errors.password}
            validation={validations.password}
            required
          />
        </>
      )}

      {loginType === "mobile" && (
        <InputField
          id="mobile"
          label="Mobile Number"
          icon={<FaMobileAlt className="text-gray-400" />}
          type="tel"
          value={formData.mobile}
          onChange={handleChange("mobile")}
          error={errors.mobile}
          validation={validations.mobile}
          required
        />
      )}

      <div>
        <Button
          onClick={handleSubmit}
          isLoading={isSubmitting}
          leftIcon={
            <FaUser className="text-red-300 group-hover:text-red-200" />
          }
        >
          Sign in
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
