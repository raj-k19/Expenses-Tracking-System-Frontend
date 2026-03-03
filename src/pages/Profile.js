import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;

if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>User not found. Please login again.</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-6">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8">

        <h2 className="text-2xl font-bold mb-6 text-center">
          👤 User Profile
        </h2>

        <div className="space-y-4">

          <div>
            <p className="text-gray-400 text-sm">Full Name</p>
            <p className="text-lg font-semibold">{user.name}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Account Created</p>
            <p className="text-lg font-semibold">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 transition py-3 rounded font-semibold"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}