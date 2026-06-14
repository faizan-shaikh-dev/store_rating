import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStore, FaEye, FaEyeSlash } from "react-icons/fa";
import { registerUser } from "../../services/authService";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.address ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return toast.error("Please fill all fields");
    }

    if (formData.name.length < 3 || formData.name.length > 60) {
      return toast.error("Name must be between 3 and 60 characters");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return toast.error("Invalid email address format");
    }

    if (formData.address.length > 400) {
      return toast.error("Address cannot exceed 400 characters");
    }

    if (formData.password.length < 8 || formData.password.length > 16) {
      return toast.error("Password must be between 8 and 16 characters");
    }

    const hasUpper = /[A-Z]/.test(formData.password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
    if (!hasUpper || !hasSpecial) {
      return toast.error(
        "Password must contain at least one uppercase letter and one special character"
      );
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        address: formData.address,
        password: formData.password,
      });

      toast.success(data.message || "Registration Successful");

      navigate("/");
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Registration Failed"
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
            Create your account and start rating stores.
          </p>
        </div>

        {/* Right Section */}
        <div className="p-6 sm:p-10">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h2>

            <p className="text-slate-400 mb-8">
              Register to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name */}
              <div>
                <label className="block text-slate-300 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl border outline-none text-white bg-slate-900 border-slate-700 focus:border-indigo-500"
                />
              </div>

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

              {/* Address */}
              <div>
                <label className="block text-slate-300 mb-2">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
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
                    placeholder="Enter password"
                    className="w-full px-4 py-3 rounded-xl border outline-none text-white bg-slate-900 border-slate-700 focus:border-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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

              {/* Confirm Password */}
              <div>
                <label className="block text-slate-300 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full px-4 py-3 rounded-xl border outline-none text-white bg-slate-900 border-slate-700 focus:border-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--primary)" }}
              >
                {loading ? "Creating Account..." : "Register"}
              </button>
            </form>

            <p className="text-center text-slate-400 mt-6">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-semibold"
                style={{ color: "var(--primary)" }}
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;