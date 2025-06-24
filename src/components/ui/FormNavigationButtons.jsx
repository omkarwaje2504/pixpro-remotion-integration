import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const FormNavigationButtons = ({ currentStep, setCurrentStep }) => {
  return (
    <div className="mt-8 flex justify-between">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={() => setCurrentStep(currentStep - 1)}
          className="flex items-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          <FaChevronLeft size={16} className="mr-1" />
          Back
        </button>
      )}

      {currentStep < 4 ? (
        <button
          type="button"
          onClick={() => setCurrentStep(currentStep + 1)}
          className="flex items-center ml-auto bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Next
          <FaChevronRight size={16} className="ml-1" />
        </button>
      ) : (
        <button
          type="submit"
          className="flex items-center ml-auto bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          disabled={!formData.consent}
        >
          Submit Advertisement
          <FaChevronRight size={16} className="ml-1" />
        </button>
      )}
    </div>
  );
};

export default FormNavigationButtons;
