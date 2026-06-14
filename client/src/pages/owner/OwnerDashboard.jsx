import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import { getOwnerDashboard } from "../../services/storeService";
import { FaStar, FaStore, FaEnvelope, FaMapMarkerAlt, FaUsers, FaSpinner, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const OwnerDashboard = () => {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getOwnerDashboard();
      if (res.success) {
        setStore(res.store);
        setRatings(res.ratings || []);
        setAvgRating(res.averageRating || 0);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load owner dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const renderStars = (count) => {
    return (
      <div className="flex gap-1 justify-center sm:justify-start">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= count ? "text-amber-400" : "text-slate-650"}
            size={14}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            Store Owner Dashboard
          </h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            Track your store performance and view customer reviews
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <FaSpinner className="text-indigo-500 animate-spin text-4xl" />
            <span className="text-slate-400 text-sm font-semibold">Loading dashboard stats...</span>
          </div>
        ) : store ? (
          <div className="space-y-10">
            
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Store Details Info Card */}
              <div className="md:col-span-2 relative overflow-hidden bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/5 rounded-bl-full pointer-events-none"></div>
                <div className="flex gap-4">
                  <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl h-fit">
                    <FaStore size={26} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{store.name}</h3>
                    <p className="text-slate-300 text-sm font-semibold mt-1.5 flex items-center gap-2">
                      <FaEnvelope className="text-indigo-400" />
                      <span>{store.email || "No email registered"}</span>
                    </p>
                    <p className="text-slate-400 text-sm mt-3 leading-relaxed flex items-start gap-2">
                      <FaMapMarkerAlt className="text-indigo-400 shrink-0 mt-1" />
                      <span>{store.address}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Store Performance Stats Card */}
              <div className="relative overflow-hidden bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl flex flex-col items-center justify-center text-center">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>
                
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Average Performance Rating</span>
                <div className="flex items-center gap-2 text-white font-extrabold text-5xl mt-3 drop-shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                  <FaStar className="text-amber-400" />
                  <span>{avgRating}</span>
                </div>
                <span className="text-slate-400 text-xs font-semibold mt-3.5 flex items-center gap-1.5 bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-slate-750">
                  <FaUsers className="text-indigo-400" />
                  <span>Based on {ratings.length} reviews</span>
                </span>
              </div>

            </div>

            {/* Ratings / Reviews Hub */}
            <div className="bg-slate-850 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden bg-slate-800/40 backdrop-blur-md">
              <div className="px-6 py-5 border-b border-slate-700 bg-slate-900/40">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Customer Review Transactions</span>
                  <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-xs text-indigo-400 font-bold">
                    {ratings.length}
                  </span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                {ratings.length === 0 ? (
                  <div className="text-center py-20 text-slate-500 font-medium">
                    No customers have rated your store yet.
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900/60 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-xs">
                      <tr>
                        <th className="py-4.5 px-6">Customer Name</th>
                        <th className="py-4.5 px-6">Customer Email</th>
                        <th className="py-4.5 px-6 text-center sm:text-left">Rating Score</th>
                        <th className="py-4.5 px-6">Review Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {ratings.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-6 font-semibold text-white">{item.user_name}</td>
                          <td className="py-4 px-6 text-slate-350 font-mono text-xs">{item.user_email}</td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              {renderStars(item.rating)}
                              <span className="text-xs font-bold text-slate-400">({item.rating}.0 / 5)</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-400 font-mono text-xs flex items-center gap-1.5 mt-3.5 border-none">
                            <FaCalendarAlt />
                            {new Date(item.created_at).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 font-semibold bg-slate-800/40 rounded-3xl border border-slate-800">
            ⚠️ You are registered as an owner, but no store has been assigned to your account by the administrator yet.
          </div>
        )}

      </div>
    </div>
  );
};

export default OwnerDashboard;
