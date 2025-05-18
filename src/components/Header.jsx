import { FaFilm, FaSignOutAlt } from "react-icons/fa";

const Header = ({ userInfo }) => {
  return (
    <header className="bg-black shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FaFilm className="text-red-500 text-2xl mr-3" />
            <div>
              <h1 className="text-xl font-bold text-red-500">BigViz</h1>
              <p className="text-[10px] text-gray-400">
                Cinema Advertising Platform
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center text-lg font-bold">
                {userInfo.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <p className="font-medium">{userInfo.name}</p>
                <p className="text-xs text-gray-400">{userInfo.role}</p>
              </div>
              <FaSignOutAlt className="text-gray-400 hover:text-red-500 cursor-pointer" onClick={() => {
                window.location.href = "/";
              }}/>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
