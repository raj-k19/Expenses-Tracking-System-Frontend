import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      alert("Registration Successful");
      navigate("/");
    } catch (error) {
      alert("Error registering user");
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

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl text-white">

        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full p-3 rounded bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

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

          <input
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full p-3 rounded bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300"
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 transition duration-300 py-3 rounded font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-300">
          Already have an account?{" "}
          <Link to="/" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}