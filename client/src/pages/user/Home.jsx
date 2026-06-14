import { useEffect, useState } from "react";
import StoreCard from "../../components/store/StoreCard";
import { getAllStores } from "../../services/storeService";
import Navbar from "../../components/layout/Navbar";
import { FaSearch, FaSortAmountDown, FaSortAmountUp, FaSpinner, FaSadTear } from "react-icons/fa";
import { toast } from "react-toastify";

const Home = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("ASC");

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await getAllStores({
        search,
        sortBy,
        order,
      });

      setStores(data.stores || []);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add a slight debounce to search to avoid excessive API requests
    const delayDebounce = setTimeout(() => {
      fetchStores();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, sortBy, order]);

  const toggleOrder = () => {
    setOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
  };

  return (
    <div
      className="min-h-screen pb-12"
      style={{ backgroundColor: "var(--background)" }}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Hero Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            Explore Stores
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Discover community ratings, view individual reviews, and share your experiences
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 border border-slate-700 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
          
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-500">
              <FaSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Search stores by name or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 outline-none text-white text-sm pl-12 pr-4 py-3.5 rounded-2xl focus:border-indigo-500 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Sort Controls */}
          <div className="w-full md:w-auto flex flex-row items-center gap-3">
            <span className="text-slate-400 text-sm font-semibold whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-44 bg-slate-900 border border-slate-700 outline-none text-white text-sm px-4 py-3.5 rounded-2xl focus:border-indigo-500 transition-all font-semibold"
            >
              <option value="name">Name</option>
              <option value="address">Address</option>
              <option value="average_rating">Average Rating</option>
            </select>

            <button
              onClick={toggleOrder}
              className="p-3.5 bg-slate-900 hover:bg-slate-750 text-indigo-400 hover:text-indigo-300 rounded-2xl border border-slate-700 transition-all shadow-md flex items-center justify-center shrink-0 active:scale-95"
              title={order === "ASC" ? "Ascending Order" : "Descending Order"}
            >
              {order === "ASC" ? (
                <FaSortAmountUp size={18} />
              ) : (
                <FaSortAmountDown size={18} />
              )}
            </button>
          </div>

        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <FaSpinner className="text-indigo-500 animate-spin text-4xl" />
            <span className="text-slate-400 text-sm font-semibold">Loading stores...</span>
          </div>
        ) : stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-slate-805 rounded-3xl border border-dashed border-slate-700 p-8">
            <div className="p-4 bg-slate-800 text-slate-500 rounded-full">
              <FaSadTear className="text-4xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No Stores Found</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">
                We couldn't find any stores matching your criteria. Try adjusting your search query.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;