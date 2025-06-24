"use client";

import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import Button from "@components/ui/Button";
import MemberTable from "@components/ui/MemberTable";
import Footer from "@components/ui/Footer";
import Header from "@components/ui/Header";
import LoadingPage from "@components/ui/LoadingPage";
import Dashboard from "@components/ui/Dashboard";
import Link from "next/link";
import Config from "@utils/Config";
import { DecryptData } from "@utils/cryptoUtils";
import { FetchDoctors } from "@actions/user";
import config from "@utils/Config";

const HomePage = ({ projectData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: "",
    role: 1,
    designation: "Medical Representative",
    avatar: "/images/avatar.jpg",
  });
  const [statistics, setStats] = useState(stats(members, config(projectData)));
  const ui = Config(projectData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const getUserInfo = DecryptData("empData");
    if (getUserInfo) {
      setUserInfo({
        name: getUserInfo?.name,
        role: getUserInfo?.role,
        designation: getUserInfo?.role_name,
      });
    }

    const getMembers = async () => {
      const membersData = await FetchDoctors(getUserInfo?.hash);
      if (membersData) {
        setMembers(membersData.data);
      } else {
        setMembers([]);
      }
    };
    getMembers();
  }, []);

  if (isLoading) {
    return <LoadingPage ui={ui} loadingtext={"Loading the Dashboard..."} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Header userInfo={userInfo} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <Dashboard stats={statistics} ui={ui} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="w-full md:w-auto">
            <h2 className="text-xl font-semibold">
              {ui.Dashboard.HomePageTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              {ui.Dashboard.HomePageSubTitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-y-0 sm:space-x-3 w-full md:w-auto">
            <Link href={`register-new-ads`}>
              <Button type="button" fullWidth={false} leftIcon={<FaUserPlus />}>
                {ui.Dashboard.HomePageButtonLabel}
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

export default HomePage;

const stats = (members, ui) => {
  const total = members.length || 1; // to avoid division by zero

  const activeMembers = members.filter(
    (member) => member.approved_status === 1
  );
  const pendingMembers = members.filter(
    (member) => member.approved_status === 0
  );

  const getPercentage = (count) => `${((count / total) * 100).toFixed(1)}%`;

  return [
    {
      label: ui.Dashboard.ActiveLabel,
      value: activeMembers.length,
      percentage: getPercentage(activeMembers.length),
    },
    {
      label: ui.Dashboard.PendingLabel,
      value: pendingMembers.length,
      percentage: getPercentage(pendingMembers.length),
    },
  ];
};


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
    speciality: "Dermatologist",
    dateAdded: "2025-05-10",
    status: "Pending",
    preview: "/previews/ad2.mp4",
    imageUrl:
      "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg?semt=ais_hybrid&w=740",
  },
  {
    id: 3,
    name: "Sweta Patil",
    speciality: "Otolaryngologist",
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
