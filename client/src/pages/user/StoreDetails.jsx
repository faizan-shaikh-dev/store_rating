import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getStoreById } from "../../services/storeService";
import { submitRating, updateRating } from "../../services/ratingService";
import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import { FaStar, FaStore, FaArrowLeft, FaRegStar, FaCalendarAlt, FaUserCircle, FaSpinner } from "react-icons/fa";

const StoreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [store, setStore] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // User rating interaction state
  const [userRating, setUserRating] = useState(0); // Current selected rating in UI
  const [hasRated, setHasRated] = useState(false); // Does user already have a rating in DB?
  const [hoverRating, setHoverRating] = useState(0); // Star hover state
  const [submittingRating, setSubmittingRating] = useState(false);

  const fetchStoreDetails = async () => {
    try {
      setLoading(true);
      const res = await getStoreById(id);
      if (res.success) {
        setStore(res.store);
        setReviews(res.ratings || []);
        
        // If the user has a submitted rating, set it
        if (res.store.user_rating) {
          setUserRating(res.store.user_rating);
          setHasRated(true);
        } else {
          setUserRating(0);
          setHasRated(false);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load store details");
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreDetails();
  }, [id]);

  const handleRatingSubmit = async () => {
    if (userRating < 1 || userRating > 5) {
      toast.error("Please select a rating between 1 and 5 stars");
      return;
    }

    try {
      setSubmittingRating(true);
      let res;
      if (hasRated) {
        res = await updateRating(id, userRating);
      } else {
        res = await submitRating(id, userRating);
      }

      if (res.success) {
        toast.success(res.message || "Rating submitted successfully!");
        fetchStoreDetails(); // Refresh details
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  // Render static stars helper
  const renderStars = (count) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= count ? "text-amber-400" : "text-slate-600"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-12">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Back Button */}
        <Link
          to={user?.role === "admin" ? "/admin/dashboard" : "/home"}
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold mb-6 transition-all"
        >
          <FaArrowLeft />
          <span>{user?.role === "admin" ? "Back to Admin Dashboard" : "Back to Stores"}</span>
        </Link>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <FaSpinner className="text-indigo-500 animate-spin text-4xl" />
            <span className="text-slate-400 text-sm font-semibold">Loading details...</span>
          </div>
        ) : store ? (
          <div className="space-y-8">
            
            {/* Store Information Card */}
            <div className="bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-bl-full pointer-events-none transition-all duration-300"></div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                <div className="flex gap-4 sm:gap-5">
                  <div className="p-5 bg-indigo-500/10 text-indigo-400 rounded-3xl shrink-0 h-fit self-start">
                    <FaStore className="text-3xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{store.name}</h2>
                    <p className="text-slate-350 text-slate-300 mt-1 font-semibold">{store.email || "No email available"}</p>
                    <p className="text-slate-400 mt-3 text-sm leading-relaxed max-w-xl">{store.address}</p>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-750 flex flex-col items-center justify-center min-w-[140px] shadow-inner">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Average Rating</span>
                  <div className="flex items-center gap-2 text-white font-extrabold text-3xl mt-1.5">
                    <FaStar className="text-amber-400" />
                    <span>{store.average_rating || "0.0"}</span>
                  </div>
                  <span className="text-slate-400 text-xs mt-1.5 font-semibold">({reviews.length} ratings)</span>
                </div>
              </div>
            </div>

            {/* Interaction Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Interactive Rating Picker (Only for Normal User) */}
              <div className="md:col-span-1">
                {user?.role === "user" ? (
                  <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl space-y-6">
                    <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-3">
                      {hasRated ? "Modify Your Rating" : "Submit Your Rating"}
                    </h3>

                    {/* Interactive Star Picker */}
                    <div className="flex flex-col items-center py-4 bg-slate-900/50 rounded-2xl border border-slate-750 shadow-inner">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Tap to Select Stars</span>
                      
                      <div className="flex gap-2.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform duration-100 hover:scale-125 focus:outline-none"
                          >
                            <FaStar
                              size={28}
                              className={
                                star <= (hoverRating || userRating)
                                  ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                                  : "text-slate-700"
                              }
                            />
                          </button>
                        ))}
                      </div>

                      <span className="text-sm font-extrabold text-white mt-4">
                        {userRating ? `${userRating} out of 5 Stars` : "Select a Rating"}
                      </span>
                    </div>

                    <button
                      onClick={handleRatingSubmit}
                      disabled={submittingRating || userRating === 0}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submittingRating ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>{hasRated ? "Update Rating" : "Submit Rating"}</span>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 text-center text-slate-400 text-sm font-semibold">
                    🛡️ Administrator accounts cannot submit or modify ratings.
                  </div>
                )}
              </div>

              {/* Right Column: Review Listing */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Community Ratings</span>
                  <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-xs text-indigo-400 font-bold">
                    {reviews.length}
                  </span>
                </h3>

                {reviews.length === 0 ? (
                  <div className="bg-slate-800/40 rounded-3xl border border-slate-800 p-8 text-center text-slate-500 font-medium">
                    No community ratings have been submitted for this store yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-md flex items-start gap-4 transition-all hover:border-slate-650"
                      >
                        <div className="text-slate-500 mt-1 shrink-0">
                          <FaUserCircle size={36} className="text-indigo-450 text-slate-500" />
                        </div>
                        <div className="space-y-2 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="font-bold text-white text-base">{rev.user_name}</span>
                            <span className="text-slate-500 text-xs flex items-center gap-1.5">
                              <FaCalendarAlt />
                              {new Date(rev.created_at).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          
                          {/* Stars */}
                          <div className="flex items-center gap-2">
                            {renderStars(rev.rating)}
                            <span className="text-xs font-bold text-slate-400">({rev.rating}/5)</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 font-medium">Store details could not be found.</div>
        )}

      </div>
    </div>
  );
};

export default StoreDetails;
