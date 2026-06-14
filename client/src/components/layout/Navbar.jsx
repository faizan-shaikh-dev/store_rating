import { Link, useNavigate } from "react-router-dom";
import { FaStore, FaSignOutAlt, FaKey, FaChartPie, FaHome } from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  const getHomeLink = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "owner") return "/owner/dashboard";
    return "/home";
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 shadow-lg backdrop-blur-md bg-opacity-95 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to={getHomeLink()}
          className="flex items-center gap-3 text-white font-extrabold text-2xl tracking-wide group"
        >
          <div className="bg-indigo-600 p-2 rounded-xl text-white transition-all duration-300 group-hover:scale-110 shadow-md shadow-indigo-500/30">
            <FaStore />
          </div>
          <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Store Rating
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4 sm:gap-6">
          {user?.role === "user" && (
            <Link
              to="/home"
              className="text-slate-300 hover:text-white font-medium flex items-center gap-2 transition-all py-2 px-3 rounded-lg hover:bg-slate-700/50"
            >
              <FaHome className="text-indigo-400" />
              <span className="hidden sm:inline">Stores</span>
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="text-slate-300 hover:text-white font-medium flex items-center gap-2 transition-all py-2 px-3 rounded-lg hover:bg-slate-700/50"
            >
              <FaChartPie className="text-indigo-400" />
              <span className="hidden sm:inline">Admin Panel</span>
            </Link>
          )}

          {user?.role === "owner" && (
            <Link
              to="/owner/dashboard"
              className="text-slate-300 hover:text-white font-medium flex items-center gap-2 transition-all py-2 px-3 rounded-lg hover:bg-slate-700/50"
            >
              <FaChartPie className="text-indigo-400" />
              <span className="hidden sm:inline">Owner Panel</span>
            </Link>
          )}

          {/* Change Password Link */}
          {user && (
            <Link
              to="/change-password"
              className="text-slate-300 hover:text-white font-medium flex items-center gap-2 transition-all py-2 px-3 rounded-lg hover:bg-slate-700/50"
            >
              <FaKey className="text-amber-400" />
              <span className="hidden sm:inline">Password</span>
            </Link>
          )}

          {/* User Display */}
          {user && (
            <div className="hidden md:flex flex-col items-end border-l border-slate-700 pl-4">
              <span className="text-slate-200 font-semibold text-sm">
                {user.name}
              </span>
              <span className="text-indigo-400 text-xs font-mono uppercase tracking-wider">
                {user.role}
              </span>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-sm transition-all duration-300 hover:opacity-90 active:scale-95 shadow-md shadow-indigo-600/30"
            style={{
              backgroundColor: "var(--primary)",
            }}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
