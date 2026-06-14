import { Link } from "react-router-dom";
import { FaStar, FaRegStar, FaEye, FaMapMarkerAlt } from "react-icons/fa";

const StoreCard = ({ store }) => {
  return (
    <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between h-full group relative overflow-hidden">
      
      {/* Decorative Gradient Background on hover */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-350 origin-left"></div>

      <div>
        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">
          {store.name}
        </h3>

        {/* Address */}
        <p className="text-slate-400 text-sm mb-6 flex items-start gap-2">
          <FaMapMarkerAlt className="text-slate-500 mt-1 shrink-0" />
          <span className="line-clamp-2 leading-relaxed">{store.address}</span>
        </p>
      </div>

      <div>
        {/* Rating Breakdown */}
        <div className="flex flex-col gap-2.5 mb-6 bg-slate-900/40 p-4 rounded-2xl border border-slate-750">
          
          {/* Average overall */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider">Overall Rating</span>
            <div className="flex items-center gap-1.5 font-bold text-white">
              <FaStar className="text-amber-400" />
              <span>{store.average_rating || "0.0"}</span>
            </div>
          </div>

          {/* User's rating */}
          <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
            <span className="text-slate-400 font-semibold uppercase tracking-wider font-semibold">Your Rating</span>
            {store.user_rating ? (
              <div className="flex items-center gap-1.5 font-bold text-indigo-400">
                <FaStar className="text-indigo-400" />
                <span>{store.user_rating}.0</span>
              </div>
            ) : (
              <span className="text-slate-500 font-bold italic">Not Rated Yet</span>
            )}
          </div>

        </div>

        {/* Action button */}
        <Link
          to={`/stores/${store.id}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95 text-sm"
        >
          <FaEye size={15} />
          <span>{store.user_rating ? "Modify Rating" : "Submit Rating"}</span>
        </Link>
      </div>

    </div>
  );
};

export default StoreCard;