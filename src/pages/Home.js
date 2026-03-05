import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

      {/* Navbar */}
      <div className="flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          💰 Expense Tracker
        </h1>

        <div className="flex gap-4">
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 border border-green-500 rounded hover:bg-green-500 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-20">
        <h2 className="text-5xl font-extrabold mb-6">
          Take Control of Your Finances
        </h2>

        <p className="text-gray-300 max-w-2xl mb-8 text-lg">
          Track your income and expenses, monitor your monthly budget,
          visualize spending trends, and generate professional financial
          reports — all in one powerful dashboard.
        </p>

        <Link
          to="/register"
          className="px-8 py-3 bg-green-500 text-lg rounded-lg hover:bg-green-600 transition shadow-lg"
        >
          Get Started
        </Link>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-10 px-10 mt-24 pb-20">

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">Visual Analytics</h3>
          <p className="text-gray-400">
            Interactive charts help you understand where your money goes.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
          <div className="text-4xl mb-4">⚠</div>
          <h3 className="text-xl font-semibold mb-2">Budget Monitoring</h3>
          <p className="text-gray-400">
            Smart warning system alerts you when you exceed your budget.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-xl font-semibold mb-2">PDF Reports</h3>
          <p className="text-gray-400">
            Export detailed monthly financial reports in PDF format.
          </p>
        </div>

      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-gray-700 text-gray-400">
        © {new Date().getFullYear()} Expense Tracker | Final Year Project
      </div>

    </div>
  );
}