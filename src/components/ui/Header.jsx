import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFilm, FaSignOutAlt } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa";

const Header = ({ userInfo }) => {
  const projectHash = localStorage.getItem("projectHash");
  const pathnames = usePathname();
  const pathnamesArray = pathnames.split("/");

  return (
    <header className="bg-white dark:bg-black shadow-lg border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center">
          {/* Left Logo/Title */}
          <div className="flex items-center">
            <FaFilm className="text-red-600 text-2xl mr-3" />
            <div>
              <h1 className="text-xl font-bold text-red-600 dark:text-red-500">
                BigViz
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Cinema Advertising Platform
              </p>
            </div>
          </div>

          {/* Right User Info */}
          <div className="flex items-center space-x-6">
            {userInfo.role === "NSM" && pathnamesArray.includes("homepage") ? (
              <div>
                <Link href={`approval-dashboard`}>
                  <p className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-200 flex gap-2 border p-2 rounded-md">
                    <FaLocationArrow className="mt-1" /> Approval Dashboard
                  </p>
                </Link>
              </div>
            ) : userInfo.role === "NSM" &&
              pathnamesArray.includes("approval-dashboard") ? (
              <div>
                <Link href={`homepage`}>
                  <p className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-200 flex gap-2 border p-2 rounded-md">
                    <FaLocationArrow className="mt-1" /> Go to Home
                  </p>
                </Link>
              </div>
            ) : (
              ""
            )}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white flex items-center justify-center text-sm font-bold">
                {userInfo.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <p className="font-medium text-gray-800 dark:text-white">
                  {userInfo.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userInfo.role}
                </p>
              </div>
              <FaSignOutAlt
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 cursor-pointer"
                onClick={() => {
                  window.location.href = "/";
                }}
                title="Sign out"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
