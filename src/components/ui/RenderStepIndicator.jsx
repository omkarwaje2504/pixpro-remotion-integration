import { FaCheck } from "react-icons/fa";

const RenderStepIndicator = ({ currentStep }) => {
  return (
    <div className="flex justify-center mb-4">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step
                  ? "bg-red-600 text-white"
                  : currentStep > step
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-400"
              }`}
            >
              {currentStep > step ? <FaCheck size={16} /> : step}
            </div>
            {step < 4 && (
              <div
                className={`w-12 h-1 ${
                  currentStep > step ? "bg-green-500" : "bg-gray-700"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenderStepIndicator;
