import React, { useState } from "react";
import { FaUserTie } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";  // adjust path if needed
import { toast } from 'sonner';
import { getDashboardPath } from "../config/roleUtils";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

const Login = () => {
  const [username, setUsername] = useState("student/teacher/principle/admin");
  const [pwd, setPwd] = useState("Shree@5456");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const Submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tokenResponse = await axios.post(`${BASE_URL}/api/token/`, {
        username,
        password: pwd,
      });

      const accessToken = tokenResponse.data.access;
      const refreshToken = tokenResponse.data.refresh;

      const meResponse = await axios.get(`${BASE_URL}/api/auth/me/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      dispatch(
        login({
          token: accessToken,
          refreshToken,
          user: meResponse.data,
        })
      );

      toast.success("Signed in successfully");
      navigate(getDashboardPath(meResponse.data.role), { replace: true });

    } catch (err) {
      const errMsg =
        err.response?.data?.detail || err.response?.data?.message || "Server error. Please try later.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center sm:px-4">
        <div className="sm:max-w-md w-full h-screen sm:h-fit bg-white dark:bg-[#0b1225] p-8 rounded-3xl shadow-2xl sm:my-4">
          <div className="flex flex-col items-center">
            <div className="border p-4 rounded-xl mb-2">
              <FaUserTie className="text-primary text-3xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-600 dark:text-white mb-1">
              Log In to Your Account
            </h2>
            <p className="text-sm text-gray-500 text-center">
              Access your profile and manage your tasks
            </p>
          </div>

          <form className="mt-6" onSubmit={Submit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-3xl px-4 py-2 focus:outline-none focus:ring-2 border text-gray-700 border-gray-400 focus:ring-primary dark:text-white dark:bg-slate-500"
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-500">
                  Password
                </label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-3xl dark:text-white border border-gray-400 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-500"
              />
            </div>

            <div className="flex items-center mb-4">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-gray-500">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-3xl font-medium transition-colors ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary"
                }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm my-2 text-gray-500">
            You don't have an account? Please contact admin to create one.
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
