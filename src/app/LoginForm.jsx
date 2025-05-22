"use client";

import { useState } from "react";
import InputField from "@components/InputField";
import Button from "@components/Button";
import { FaTicketAlt, FaLock, FaMobileAlt, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import config from "@utils/Config";
import { LoginSubmission } from "@actions/loginApis";

const validations = {
  code: {
    regex: /^[A-Z0-9]{4,10}$/,
    message: "Enter a valid access code (4–10 numbers).",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    const newErrors = {};

    if (loginType === "code" || loginType === "code-password") {
      const codeRule = validations.code;
      if (!codeRule.regex.test(formData.code)) {
        newErrors.code = codeRule.message;
      }
    }

    if (loginType === "code-password") {
      const passRule = validations.password;
      if (!passRule.regex.test(formData.password)) {
        newErrors.password = passRule.message;
      }
    }

    if (loginType === "mobile") {
      const mobileRule = validations.mobile;
      if (!mobileRule.regex.test(formData.mobile)) {
        newErrors.mobile = mobileRule.message;
      }
    }

    // If any errors found, stop form submit

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    } else {
      // If no errors, proceed with form submission
      const loginResponse = await LoginSubmission(formData);
      if (loginResponse) {
        router.push("/homepage");
      } else {
        setErrors({ form: "Login failed. Please try again." });
      }
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <form>
        {loginType === "code" && (
          <InputField
            id="code"
            label={config().loginPage.loginLabel}
            icon={<FaTicketAlt className="text-gray-400" />}
            type="text"
            value={formData.code}
            onChange={handleChange("code")}
            validation={validations.code}
            required
          />
        )}

        {loginType === "code-password" && (
          <>
            <InputField
              id="code"
              label={config().loginPage.loginLabel}
              icon={<FaTicketAlt className="text-gray-400" />}
              type="text"
              value={formData.code}
              onChange={handleChange("code")}
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
            validation={validations.mobile}
            required
          />
        )}

        <div>
          <Button
            type="submit"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            leftIcon={
              <FaUser className="text-red-300 group-hover:text-red-200" />
            }
          >
            {config().loginPage.loginButtomLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
