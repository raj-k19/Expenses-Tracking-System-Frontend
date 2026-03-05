import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">

      {/* Particle Background */}
      <Particles
        className="absolute inset-0"
        init={particlesInit}
        options={{
          background: { color: "#0f172a" },
          particles: {
            number: { value: 60 },
            color: { value: "#10b981" },
            links: {
              enable: true,
              color: "#10b981",
              distance: 150,
              opacity: 0.3
            },
            move: { enable: true, speed: 1 },
            size: { value: 3 },
            opacity: { value: 0.6 }
          }
        }}
      />

      {/* Coin Rain */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-400 text-2xl animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 5}s`,
              top: `-${Math.random() * 100}px`
            }}
          >
            💰
          </div>
        ))}
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl text-white">

        <h2 className="text-3xl font-bold text-center mb-6">
          Expense Tracker Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 rounded bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 rounded bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 transition duration-300 py-3 rounded font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}