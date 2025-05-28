"use client";
import Footer from "@components/ui/Footer";
import Header from "@components/ui/Header";
import InputField from "@components/ui/InputField";
import PhotoUpload from "@components/ui/PhotoUpload";
import { DecryptData, EncryptData } from "@utils/cryptoUtils";
import { useEffect, useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaUpload,
  FaFilm,
  FaMapMarkerAlt,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaImage,
  FaMicrophone,
  FaChevronRight,
  FaChevronLeft,
  FaStar,
} from "react-icons/fa";

const userInfo = {
  name: "John Doe",
  role: "Admin",
  avatar: "/images/avatar.jpg", // This would be a real path in your project
};

export default function DoctorAdForm() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form submission here
    console.log("Form submitted:");
    // Reset form and show success message
    alert("Advertisement submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header userInfo={userInfo} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold">Add New Doctor Advertisement</h1>
          <p className="text-gray-400 mb-4 text-sm md:text-md">
            Complete the form below to create a new cinema advertisement for
            medical professionals
          </p>

          <RenderStepIndicator currentStep={currentStep} />
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 rounded-lg p-4 border border-gray-800"
          >
            <RenderStepContent currentStep={currentStep} />

            <NavigationButtons
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

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

const NavigationButtons = ({ currentStep, setCurrentStep }) => {
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

const RenderStepContent = ({ currentStep }) => {
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    bio: "",
    experience: "",
    education: "",
    photo: null,
    audio: null,
    theaterPreference: "",
    showDates: "",
    showTimes: "",
    consent: false,
  });


  switch (currentStep) {
    case 1:
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">
            Doctor Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <InputField
                id="name"
                label="Name*"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <InputField
                id="specialty"
                label="Specialty*"
                type="select"
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
                required
                options={[
                  { label: "Cardiologist", value: "Cardiologist" },
                  { label: "Dermatologist", value: "Dermatologist" },
                  {
                    label: "Orthopedic Surgeon",
                    value: "Orthopedic Surgeon",
                  },
                  { label: "Otolaryngologist", value: "Otolaryngologist" },
                  { label: "Pediatrician", value: "Pediatrician" },
                  { label: "Neurologist", value: "Neurologist" },
                  { label: "Psychiatrist", value: "Psychiatrist" },
                  { label: "Ophthalmologist", value: "Ophthalmologist" },
                ]}
              />
            </div>
          </div>
          <div>
            <InputField
              id="bio"
              label="Professional Bio*"
              type="text"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="experience"
              label="Years of Experience"
              type="number"
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
            />
            <InputField
              id="education"
              label="Education"
              type="text"
              value={formData.education}
              onChange={(e) =>
                setFormData({ ...formData, education: e.target.value })
              }
            />
          </div>
        </div>
      );
    case 2:
      return (
        <div className="space-y-6">
          <PhotoUpload />
        </div>
      );
    case 3:
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">
            Upload Advertisement Audio
          </h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            {audioName ? (
              <div className="flex items-center justify-between bg-gray-700 rounded p-4">
                <div className="flex items-center">
                  <FaMicrophone className="text-gray-300 mr-3" />
                  <span className="text-white">{audioName}</span>
                </div>
                <button
                  onClick={removeAudio}
                  className="bg-red-600 rounded-full p-1"
                >
                  <FaTimes size={16} color="white" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <FaMicrophone
                  className="mx-auto mb-4 text-gray-400"
                  size={48}
                />
                <p className="text-gray-300 mb-4">
                  Drag and drop your audio file here, or click to browse
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  MP3 or WAV format, max 30 seconds, max 10MB
                </p>
                <label className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded cursor-pointer">
                  Browse Files
                  <input
                    type="file"
                    onChange={handleAudioUpload}
                    className="hidden"
                    accept=".mp3,.wav"
                  />
                </label>
              </div>
            )}
          </div>
          <div className="text-gray-400 text-sm">
            <p>* Audio will be played before movie trailers</p>
            <p>* Keep your message clear, concise and professional</p>
            <p>
              * Recommended script structure: Introduction, credentials,
              services offered, location, contact information
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Audio Guidelines</h3>
            <ul className="text-gray-300 text-sm list-disc pl-5 space-y-1">
              <li>Speak clearly at a moderate pace</li>
              <li>Avoid background noise during recording</li>
              <li>Include your name, specialty, and key services</li>
              <li>Mention your clinic location and contact method</li>
              <li>End with a clear call to action</li>
            </ul>
          </div>
        </div>
      );
    case 4:
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">
            Cinema Selection & Final Details
          </h2>

          {/* Theater Preferences */}
          <div>
            <InputField
              id="theaterPreference"
              label="Select Cinema Locations*"
              type="select"
              value={formData.theaterPreference}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  theaterPreference: e.target.value,
                })
              }
              required
              options={[
                {
                  label: "PVR Phoenix Marketcity",
                  value: "PVR Phoenix Marketcity",
                },
                { label: "PVR Viman Nagar", value: "PVR Viman Nagar" },
                { label: "PVR Pavillion Mall", value: "PVR Pavillion Mall" },
                { label: "PVR Kumar Pacific", value: "PVR Kumar Pacific" },
                {
                  label: "PVR Amanora Town Centre",
                  value: "PVR Amanora Town Centre",
                },
              ]}
            />
          </div>

          {/* Show Dates */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                id="showDates"
                label="Advertisement Start Date*"
                type="date"
                value={formData.showDates}
                onChange={(e) =>
                  setFormData({ ...formData, showDates: e.target.value })
                }
                required
              />

              <InputField
                id="showTimes"
                label="Select Run Duration*"
                type="select"
                value={formData.showTimes}
                onChange={(e) =>
                  setFormData({ ...formData, showTimes: e.target.value })
                }
                required
                options={[
                  { label: "1 week", value: "1 week" },
                  { label: "2 weeks", value: "2 weeks" },
                  { label: "1 month", value: "1 month" },
                  { label: "3 months", value: "3 months" },
                ]}
              />
            </div>
          </div>

          {/* Movie Selection Preview */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-white font-medium mb-4">
              Your Ad Will Run Before These Films
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <img
                  src="/api/placeholder/120/180"
                  alt="Movie poster"
                  className="rounded w-full"
                />
                <div className="flex items-center">
                  <FaStar color="#FFD700" size={14} className="mr-1" />
                  <span className="text-white text-xs">8.5</span>
                </div>
                <p className="text-white text-sm">Top Blockbuster</p>
              </div>
              <div className="space-y-2">
                <img
                  src="/api/placeholder/120/180"
                  alt="Movie poster"
                  className="rounded w-full"
                />
                <div className="flex items-center">
                  <FaStar color="#FFD700" size={14} className="mr-1" />
                  <span className="text-white text-xs">7.8</span>
                </div>
                <p className="text-white text-sm">New Release</p>
              </div>
              <div className="space-y-2">
                <img
                  src="/api/placeholder/120/180"
                  alt="Movie poster"
                  className="rounded w-full"
                />
                <div className="flex items-center">
                  <FaStar color="#FFD700" size={14} className="mr-1" />
                  <span className="text-white text-xs">8.1</span>
                </div>
                <p className="text-white text-sm">Family</p>
              </div>
              <div className="space-y-2">
                <img
                  src="/api/placeholder/120/180"
                  alt="Movie poster"
                  className="rounded w-full"
                />
                <div className="flex items-center">
                  <FaStar color="#FFD700" size={14} className="mr-1" />
                  <span className="text-white text-xs">9.0</span>
                </div>
                <p className="text-white text-sm">Premium</p>
              </div>
            </div>
          </div>

          {/* Cinema Theater Gallery */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-white font-medium mb-4">Theater Preview</h3>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/api/placeholder/250/150"
                alt="Cinema interior"
                className="rounded w-full"
              />
              <img
                src="/api/placeholder/250/150"
                alt="Cinema screen"
                className="rounded w-full"
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="mt-6">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
              <span className="ml-2 text-gray-300 text-sm">
                I confirm that all information provided is accurate and I have
                the rights to use the uploaded media. I consent to BigViz
                displaying this advertisement in the selected cinema locations.
              </span>
            </label>
          </div>
        </div>
      );
    default:
      return null;
  }
};
