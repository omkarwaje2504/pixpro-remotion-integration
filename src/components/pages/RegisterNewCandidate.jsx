"use client";
import Footer from "@components/ui/Footer";
import Header from "@components/ui/Header";
import InputField from "@components/ui/InputField";
import PhotoUploadEditor from "@components/ui/PhotoUpload";
import { DecryptData, EncryptData } from "@utils/cryptoUtils";
import RenderStepIndicator from "@components/ui/RenderStepIndicator";
import FormNavigationButtons from "@components/ui/FormNavigationButtons";
import AudioUploadEditor from "@components/ui/AudioUploadEditor";
import { useEffect, useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaMicrophone,
  FaChevronRight,
  FaChevronLeft,
  FaStar,
} from "react-icons/fa";

const userInfo = {
  name: "John Doe",
  role: "Admin",
  avatar: "/images/avatar.jpg",
};

export default function RegisterNewCandidate({ projectData }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [photoUploadStatus, setPhotoUploadStatus] = useState(false);
  const [audioUploadStatus, setAudioUploadStatus] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
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
            onSubmit={(e) => handleSubmit(e)}
            className="bg-gray-900 rounded-lg p-4 border border-gray-800"
          >
            <RenderStepContent
              currentStep={currentStep}
              setPhotoUploadStatus={setPhotoUploadStatus}
              setAudioUploadStatus={setAudioUploadStatus}
            />

            <FormNavigationButtons
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              photoUploadStatus={photoUploadStatus}
            />
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const RenderStepContent = ({
  currentStep,
  setPhotoUploadStatus,
  setAudioUploadStatus,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    degree: "",
    clinic_name: "",
    clinic_location: "",
    logo: "",
    photo: null,
    audio: null,
    theaterPreference: "",
    showDates: "",
    showTimes: "",
    consent: false,
  });

  const [audioName, setAudioName] = useState("");

  const [validationStatus, setValidationStatus] = useState({
    name: false,
    speciality: false,
    bio: false,
  });

  const handleValidationChange = (key) => (isValid) => {
    setValidationStatus((prev) => ({
      ...prev,
      [key]: isValid,
    }));
  };

  const isFormValid = () => {
    if (loginType === "code") return validationStatus.code;
    if (loginType === "code-password")
      return validationStatus.code && validationStatus.password;
    if (loginType === "mobile") return validationStatus.mobile;
    return false;
  };

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
                value={formData.speciality}
                onChange={(e) =>
                  setFormData({ ...formData, speciality: e.target.value })
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
              id="degree"
              label="Degree*"
              type="text"
              value={formData.degree}
              onChange={(e) =>
                setFormData({ ...formData, degree: e.target.value })
              }
              required
            />
          </div>
          <div>
            <InputField
              id="clinic_name"
              label="Clinic Name*"
              type="text"
              value={formData.clinic_name}
              onChange={(e) =>
                setFormData({ ...formData, clinic_name: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="clinic_location"
              label="Clinic Location*"
              type="text"
              required
              value={formData.clinic_location}
              onChange={(e) =>
                setFormData({ ...formData, clinic_location: e.target.value })
              }
            />
            <InputField
              id="logo"
              label="Want to upload a logo?"
              type="file"
              value={formData.logo}
              onChange={(e) =>
                setFormData({ ...formData, logo: e.target.value })
              }
            />
          </div>
        </div>
      );
    case 2:
      return (
        <div className="space-y-6">
          <PhotoUploadEditor setPhotoUploadStatus={setPhotoUploadStatus} />
        </div>
      );
    case 3:
      return (
        <div className="space-y-6">
          <AudioUploadEditor setAudioUploadStatus={setAudioUploadStatus} />
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
