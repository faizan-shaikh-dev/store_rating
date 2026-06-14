import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { changePassword } from "../../services/authService";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import { FaKey, FaEye, FaEyeSlash, FaSpinner, FaLock } from "react-icons/fa";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const validateNewPassword = (pwd) => {
    if (pwd.length < 8 || pwd.length > 16) return false;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    return hasUpper && hasSpecial;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill in all fields");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Confirm password does not match");
    }

    if (!validateNewPassword(newPassword)) {
      return toast.error(
        "New password must be 8-16 characters and contain at least one uppercase letter and one special character"
      );
    }

    try {
      setLoading(true);
      const res = await changePassword({ oldPassword, newPassword });
      if (res.success) {
        toast.success(res.message || "Password updated successfully!");
        
        // Redirect to default role landing page
        if (user?.role === "admin") {
          navigate("/admin/dashboard");
        } else if (user?.role === "owner") {
          navigate("/owner/dashboard");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-12">
      <Navbar />

      <div className="max-w-md mx-auto px-4 pt-12">
        <div className="bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none"></div>
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center mb-4">
              <FaLock size={20} />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Update Password</h2>
            <p className="text-slate-400 text-xs mt-1">Protect your account with a secure password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Old Password */}
            <div>
              <label className="block text-slate-300 text-xs uppercase tracking-wider font-bold mb-2">Old Password</label>
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  name="oldPassword"
                  placeholder="Enter current password"
                  value={passwords.oldPassword}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 outline-none text-white text-sm px-4 py-3 rounded-xl focus:border-indigo-500 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-200 text-slate-400 transition-colors"
                >
                  {showOld ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-slate-300 text-xs uppercase tracking-wider font-bold mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  placeholder="8-16 chars, 1 uppercase, 1 special"
                  value={passwords.newPassword}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 outline-none text-white text-sm px-4 py-3 rounded-xl focus:border-indigo-500 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-455 hover:text-slate-200 text-slate-400 transition-colors"
                >
                  {showNew ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-slate-300 text-xs uppercase tracking-wider font-bold mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repeat new password"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 outline-none text-white text-sm px-4 py-3 rounded-xl focus:border-indigo-500 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-455 hover:text-slate-200 text-slate-400 transition-colors"
                >
                  {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
