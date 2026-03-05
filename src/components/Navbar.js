import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ darkMode, setDarkMode, logout }) {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div
      className={`z-50 shadow-md rounded-xl px-6 py-4 flex justify-between items-center mb-6 transition ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      {/* Logo */}
      <Link
        to={localStorage.getItem("token") ? "/dashboard" : "/"}
        className="flex items-center gap-3 hover:opacity-80 transition"
      >
        <div className="text-2xl">💰</div>
        <h1 className="text-2xl font-bold tracking-wide">
          Expense Tracker
        </h1>
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">

        {user && (
          <span className="text-green-400 text-sm">
            Welcome back, {user.name} 👋
          </span>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-lg transition ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>

        {/* Avatar */}
        <div
          onClick={() => setOpen(!open)}
          className={`w-10 h-10 flex items-center justify-center rounded-full font-bold cursor-pointer ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          }`}
        >
          {userInitial}
        </div>

        {/* Dropdown */}
        {open && (
          <div
            className={`absolute right-0 top-14 w-48 rounded-lg shadow-lg transition ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
          >
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 hover:bg-gray-500/20 transition"
            >
              👤 Profile
            </Link>

            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 hover:bg-gray-500/20 transition"
            >
              🏠 Home
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 hover:bg-gray-500/20 transition"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}