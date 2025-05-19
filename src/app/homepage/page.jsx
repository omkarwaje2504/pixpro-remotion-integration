"use client";

import { useState, useEffect } from "react";
import { FaUserPlus, FaFilm } from "react-icons/fa";
import Button from "@components/Button";

import MemberTable from "@components/MemberTable";
import Footer from "@components/Footer";
import Header from "@components/Header";
import LoadingPage from "@components/LoadingPage";
import Link from "next/link";
// Mock data for demonstration
const userInfo = {
  name: "John Doe",
  role: "Admin",
  avatar: "/images/avatar.jpg", // This would be a real path in your project
};

const stats = [
  { label: "Active Clients", value: 156, change: "+8%" },
  { label: "Pending Approvals", value: 7, change: "-3%" },
];

const members = [
  {
    id: 1,
    name: "Omkar Waje",
    speciality: "Cardiologist",
    dateAdded: "2025-05-12",
    status: "Active",
    preview: "/previews/ad1.mp4",
    imageUrl:
      "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg?semt=ais_hybrid&w=740",
  },
  {
    id: 2,
    name: "Rohini Patil",
    speciality: "Dermatalogist",
    dateAdded: "2025-05-10",
    status: "Pending",
    preview: "/previews/ad2.mp4",
    imageUrl:
      "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg?semt=ais_hybrid&w=740",
  },
  {
    id: 3,
    name: "Sweta Patil",
    speciality: "Otholaryngologist",
    dateAdded: "2025-05-08",
    status: "Active",
    preview: "/previews/ad3.mp4",
    imageUrl:
      "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg?semt=ais_hybrid&w=740",
  },
  {
    id: 4,
    name: "Vedant Thakur",
    speciality: "Orthopedic Surgeon",
    dateAdded: "2025-05-07",
    status: "Active",
    preview: "/previews/ad4.mp4",
    imageUrl: "",
  },
  {
    id: 5,
    name: "EduSmart Academy",
    speciality: "New Course Enrollment",
    dateAdded: "2025-05-05",
    status: "Inactive",
    preview: "/previews/ad5.mp4",
    imageUrl: "",
  },
  {
    id: 6,
    name: "FitLife Gym",
    speciality: "Membership Promotion",
    dateAdded: "2025-05-03",
    status: "Active",
    preview: "/previews/ad6.mp4",
    imageUrl: "/",
  },
];

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingPage label="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header userInfo={userInfo} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <Dashboard stats={stats} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="w-full md:w-auto">
            <h2 className="text-xl font-semibold">Client Ad Management</h2>
            <p className="text-gray-400 text-xs">
              Manage all client advertisements from here
            </p>
          </div>

          <div className="flex flex-col sm:flex-row  sm:space-y-0 sm:space-x-3 w-full md:w-auto">
            <Link href="/client">
              <Button type="button" fullWidth={false} leftIcon={<FaUserPlus />}>
                Add New Client
              </Button>
            </Link>
          </div>
        </div>

        <MemberTable
          members={members}
          onPreview={(id) => console.log("Preview", id)}
          onEdit={(id) => console.log("Edit", id)}
          onDownload={(id) => console.log("Download", id)}
        />
      </main>

      <Footer />
    </div>
  );
};

const Dashboard = ({ stats }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-2 border border-gray-700 shadow-lg transition-all hover:border-red-500"
          >
            <div className="flex flex-col md:flex-row justify-between">
              <p className="text-gray-300">{stat.label}</p>
              <span
                className={`text-xs w-fit font-medium px-2 py-1 rounded ${stat.change.startsWith("+") ? "text-green-500 bg-green-900/30" : "text-red-500 bg-red-900/30"}`}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
