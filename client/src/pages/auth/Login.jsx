import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStore, FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(formData);

      login(data.user, data.token);

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="w-full max-w-5xl bg-slate-800 rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2">
        
        {/* Left Section */}
        <div className="hidden lg:flex flex-col justify-center items-center p-10 border-r border-slate-700">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <FaStore className="text-white text-4xl" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Store Rating System
          </h1>

          <p className="text-slate-400 text-center max-w-sm">
            Discover stores, rate your experience, and help others make better
            decisions.
          </p>
        </div>

        {/* Right Section */}
        <div className="p-6 sm:p-10">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome Back 
            </h2>

            <p className="text-slate-400 mb-8">
              Sign in to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email */}
              <div>
                <label className="block text-slate-300 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl border outline-none text-white bg-slate-900 border-slate-700 focus:border-indigo-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-300 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-xl border outline-none text-white bg-slate-900 border-slate-700 focus:border-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--primary)" }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Register Link */}
            <p className="text-center text-slate-400 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold"
                style={{ color: "var(--primary)" }}
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;