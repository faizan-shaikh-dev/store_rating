import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import { toast } from "react-toastify";
import {
  FaUsers,
  FaStore,
  FaStar,
  FaSearch,
  FaPlus,
  FaTimes,
  FaEye,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSpinner,
  FaArrowRight
} from "react-icons/fa";
import {
  getDashboardStats,
  getAdminUsers,
  getAdminUserById,
  addAdminUser,
  addAdminStore,
  getAdminStores,
} from "../../services/adminService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [activeTab, setActiveTab] = useState("users"); // "users" or "stores"
  const [loading, setLoading] = useState(true);

  // Users listing state
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [userSort, setUserSort] = useState({ field: "name", order: "ASC" });

  // Stores listing state
  const [stores, setStores] = useState([]);
  const [storeSearch, setStoreSearch] = useState("");
  const [storeSort, setStoreSort] = useState({ field: "name", order: "ASC" });

  // Modals state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Form states
  const [ownersList, setOwnersList] = useState([]); // List of owners for store assignment
  const [loadingOwners, setLoadingOwners] = useState(false);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  // Fetch Dashboard Statistics
  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Stats Fetch Error:", error);
    }
  };

  // Fetch Users List
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers({
        search: userSearch,
        role: userRoleFilter,
        sortBy: userSort.field,
        order: userSort.order,
      });
      if (res.success) {
        setUsers(res.users);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Stores List
  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await getAdminStores({
        search: storeSearch,
        sortBy: storeSort.field,
        order: storeSort.order,
      });
      if (res.success) {
        setStores(res.stores);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Owner List for Add Store Dropdown
  const fetchOwners = async () => {
    try {
      setLoadingOwners(true);
      const res = await getAdminUsers({ role: "owner" });
      if (res.success) {
        setOwnersList(res.users);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOwners(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else {
      fetchStores();
    }
  }, [activeTab, userSearch, userRoleFilter, userSort, storeSearch, storeSort]);

  // Handle User Sort Toggle
  const handleUserSort = (field) => {
    setUserSort((prev) => ({
      field,
      order: prev.field === field && prev.order === "ASC" ? "DESC" : "ASC",
    }));
  };

  // Handle Store Sort Toggle
  const handleStoreSort = (field) => {
    setStoreSort((prev) => ({
      field,
      order: prev.field === field && prev.order === "ASC" ? "DESC" : "ASC",
    }));
  };

  // Handle View User Details
  const handleViewUserDetails = async (id) => {
    try {
      setShowUserDetailModal(true);
      setLoadingDetail(true);
      setSelectedUserDetail(null);
      const res = await getAdminUserById(id);
      if (res.success) {
        setSelectedUserDetail(res.user);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load user details");
      setShowUserDetailModal(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  // User Form Validation
  const validateUserForm = () => {
    const { name, email, password, address } = userForm;
    if (!name || !email || !password || !address) {
      toast.error("All fields are required");
      return false;
    }
    if (name.length < 3 || name.length > 60) {
      toast.error("Name must be between 3 and 60 characters");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address format");
      return false;
    }
    if (address.length > 400) {
      toast.error("Address cannot exceed 400 characters");
      return false;
    }
    if (password.length < 8 || password.length > 16) {
      toast.error("Password must be between 8 and 16 characters");
      return false;
    }
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasUpper || !hasSpecial) {
      toast.error("Password must contain at least one uppercase letter and one special character");
      return false;
    }
    return true;
  };

  // Store Form Validation
  const validateStoreForm = () => {
    const { name, email, address, owner_id } = storeForm;
    if (!name || !email || !address || !owner_id) {
      toast.error("All fields are required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid store email format");
      return false;
    }
    if (address.length > 400) {
      toast.error("Address cannot exceed 400 characters");
      return false;
    }
    return true;
  };

  // Add User Submit Handler
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!validateUserForm()) return;

    try {
      const res = await addAdminUser(userForm);
      if (res.success) {
        toast.success("User created successfully!");
        setShowAddUserModal(false);
        setUserForm({
          name: "",
          email: "",
          password: "",
          address: "",
          role: "user",
        });
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create user");
    }
  };

  // Add Store Submit Handler
  const handleAddStoreSubmit = async (e) => {
    e.preventDefault();
    if (!validateStoreForm()) return;

    try {
      const res = await addAdminStore(storeForm);
      if (res.success) {
        toast.success("Store created successfully!");
        setShowAddStoreModal(false);
        setStoreForm({
          name: "",
          email: "",
          address: "",
          owner_id: "",
        });
        fetchStores();
        fetchStats();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create store");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              System Administrator Dashboard
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Real-time analytics and store management hub
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          
          {/* Card Users */}
          <div className="relative overflow-hidden bg-slate-800 rounded-3xl p-6 border border-slate-700 hover:border-indigo-500/50 transition-all duration-300 shadow-xl group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-300"></div>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl">
                <FaUsers className="text-2xl" />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                  Total Users
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-1">
                  {stats.totalUsers}
                </h3>
              </div>
            </div>
          </div>

          {/* Card Stores */}
          <div className="relative overflow-hidden bg-slate-800 rounded-3xl p-6 border border-slate-700 hover:border-violet-500/50 transition-all duration-300 shadow-xl group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-bl-full pointer-events-none group-hover:bg-violet-500/10 transition-all duration-300"></div>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-violet-500/10 text-violet-400 rounded-2xl">
                <FaStore className="text-2xl" />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                  Total Stores
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-1">
                  {stats.totalStores}
                </h3>
              </div>
            </div>
          </div>

          {/* Card Ratings */}
          <div className="relative overflow-hidden bg-slate-800 rounded-3xl p-6 border border-slate-700 hover:border-amber-500/50 transition-all duration-300 shadow-xl group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:bg-amber-500/10 transition-all duration-300"></div>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-500/10 text-amber-400 rounded-2xl">
                <FaStar className="text-2xl" />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                  Total Ratings
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-1">
                  {stats.totalRatings}
                </h3>
              </div>
            </div>
          </div>

        </div>

        {/* Listings Hub */}
        <div className="bg-slate-850 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden bg-slate-800/40 backdrop-blur-md">
          
          {/* Tabs header */}
          <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4 flex-wrap gap-4">
            <div className="flex gap-2 bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveTab("users")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "users"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Users List
              </button>
              <button
                onClick={() => setActiveTab("stores")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "stores"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Stores List
              </button>
            </div>

            <div>
              {activeTab === "users" ? (
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95"
                >
                  <FaPlus size={14} />
                  <span>Add User</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    fetchOwners();
                    setShowAddStoreModal(true);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95"
                >
                  <FaPlus size={14} />
                  <span>Add Store</span>
                </button>
              )}
            </div>
          </div>

          {/* Filtering, Search and Sort Panel */}
          <div className="px-6 py-4 bg-slate-850/50 border-b border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
            {activeTab === "users" ? (
              <>
                {/* Search */}
                <div className="relative w-full sm:max-w-md">
                  <span className="absolute inset-y-0 left-4 flex items-center text-slate-500">
                    <FaSearch size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search users by name, email, or address..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 outline-none text-white text-sm pl-12 pr-4 py-3 rounded-2xl focus:border-indigo-500 transition-all placeholder:text-slate-500"
                  />
                </div>

                {/* Filter */}
                <div className="w-full sm:w-auto flex items-center gap-3">
                  <span className="text-slate-400 text-sm hidden md:inline font-medium">Filter Role:</span>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="w-full sm:w-44 bg-slate-900 border border-slate-700 outline-none text-white text-sm px-4 py-3 rounded-2xl focus:border-indigo-500 transition-all font-semibold"
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Administrator</option>
                    <option value="user">Normal User</option>
                    <option value="owner">Store Owner</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                {/* Search Stores */}
                <div className="relative w-full sm:max-w-md">
                  <span className="absolute inset-y-0 left-4 flex items-center text-slate-500">
                    <FaSearch size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search stores by name or address..."
                    value={storeSearch}
                    onChange={(e) => setStoreSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 outline-none text-white text-sm pl-12 pr-4 py-3 rounded-2xl focus:border-indigo-500 transition-all placeholder:text-slate-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <FaSpinner className="text-indigo-500 animate-spin text-4xl" />
                <span className="text-slate-400 text-sm font-semibold">Loading data...</span>
              </div>
            ) : activeTab === "users" ? (
              users.length === 0 ? (
                <div className="text-center py-16 text-slate-500 font-medium">No users found match criteria.</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/60 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-xs">
                    <tr>
                      <th
                        onClick={() => handleUserSort("name")}
                        className="py-4 px-6 cursor-pointer hover:bg-slate-900/80 transition-all select-none"
                      >
                        <div className="flex items-center gap-2">
                          <span>Name</span>
                          {userSort.field === "name" ? (
                            userSort.order === "ASC" ? <FaSortAmountUp className="text-indigo-400" /> : <FaSortAmountDown className="text-indigo-400" />
                          ) : null}
                        </div>
                      </th>
                      <th
                        onClick={() => handleUserSort("email")}
                        className="py-4 px-6 cursor-pointer hover:bg-slate-900/80 transition-all select-none"
                      >
                        <div className="flex items-center gap-2">
                          <span>Email</span>
                          {userSort.field === "email" ? (
                            userSort.order === "ASC" ? <FaSortAmountUp className="text-indigo-400" /> : <FaSortAmountDown className="text-indigo-400" />
                          ) : null}
                        </div>
                      </th>
                      <th
                        onClick={() => handleUserSort("address")}
                        className="py-4 px-6 cursor-pointer hover:bg-slate-900/80 transition-all select-none"
                      >
                        <div className="flex items-center gap-2">
                          <span>Address</span>
                          {userSort.field === "address" ? (
                            userSort.order === "ASC" ? <FaSortAmountUp className="text-indigo-400" /> : <FaSortAmountDown className="text-indigo-400" />
                          ) : null}
                        </div>
                      </th>
                      <th
                        onClick={() => handleUserSort("role")}
                        className="py-4 px-6 cursor-pointer hover:bg-slate-900/80 transition-all select-none"
                      >
                        <div className="flex items-center gap-2">
                          <span>Role</span>
                          {userSort.field === "role" ? (
                            userSort.order === "ASC" ? <FaSortAmountUp className="text-indigo-400" /> : <FaSortAmountDown className="text-indigo-400" />
                          ) : null}
                        </div>
                      </th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {users.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6 font-semibold text-white">{item.name}</td>
                        <td className="py-4 px-6 text-slate-300 font-mono text-xs">{item.email}</td>
                        <td className="py-4 px-6 text-slate-400 truncate max-w-[15rem]">{item.address}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              item.role === "admin"
                                ? "bg-red-500/10 text-red-400"
                                : item.role === "owner"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-emerald-500/10 text-emerald-400"
                            }`}
                          >
                            {item.role === "admin" ? "Admin" : item.role === "owner" ? "Store Owner" : "Normal User"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleViewUserDetails(item.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all text-xs font-bold"
                          >
                            <FaEye />
                            <span>Details</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : stores.length === 0 ? (
              <div className="text-center py-16 text-slate-500 font-medium">No stores found matching criteria.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/60 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-xs">
                  <tr>
                    <th
                      onClick={() => handleStoreSort("name")}
                      className="py-4 px-6 cursor-pointer hover:bg-slate-900/80 transition-all select-none"
                    >
                      <div className="flex items-center gap-2">
                        <span>Store Name</span>
                        {storeSort.field === "name" ? (
                          storeSort.order === "ASC" ? <FaSortAmountUp className="text-indigo-400" /> : <FaSortAmountDown className="text-indigo-400" />
                        ) : null}
                      </div>
                    </th>
                    <th
                      onClick={() => handleStoreSort("email")}
                      className="py-4 px-6 cursor-pointer hover:bg-slate-900/80 transition-all select-none"
                    >
                      <div className="flex items-center gap-2">
                        <span>Email</span>
                        {storeSort.field === "email" ? (
                          storeSort.order === "ASC" ? <FaSortAmountUp className="text-indigo-400" /> : <FaSortAmountDown className="text-indigo-400" />
                        ) : null}
                      </div>
                    </th>
                    <th
                      onClick={() => handleStoreSort("address")}
                      className="py-4 px-6 cursor-pointer hover:bg-slate-900/80 transition-all select-none"
                    >
                      <div className="flex items-center gap-2">
                        <span>Address</span>
                        {storeSort.field === "address" ? (
                          storeSort.order === "ASC" ? <FaSortAmountUp className="text-indigo-400" /> : <FaSortAmountDown className="text-indigo-400" />
                        ) : null}
                      </div>
                    </th>
                    <th
                      onClick={() => handleStoreSort("owner_name")}
                      className="py-4 px-6 cursor-pointer hover:bg-slate-900/80 transition-all select-none"
                    >
                      <div className="flex items-center gap-2">
                        <span>Owner</span>
                        {storeSort.field === "owner_name" ? (
                          storeSort.order === "ASC" ? <FaSortAmountUp className="text-indigo-400" /> : <FaSortAmountDown className="text-indigo-400" />
                        ) : null}
                      </div>
                    </th>
                    <th
                      onClick={() => handleStoreSort("average_rating")}
                      className="py-4 px-6 cursor-pointer hover:bg-slate-900/80 transition-all select-none"
                    >
                      <div className="flex items-center gap-2">
                        <span>Rating</span>
                        {storeSort.field === "average_rating" ? (
                          storeSort.order === "ASC" ? <FaSortAmountUp className="text-indigo-400" /> : <FaSortAmountDown className="text-indigo-400" />
                        ) : null}
                      </div>
                    </th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {stores.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6 font-semibold text-white">{item.name}</td>
                      <td className="py-4 px-6 text-slate-300 font-mono text-xs">{item.email}</td>
                      <td className="py-4 px-6 text-slate-400 truncate max-w-[15rem]">{item.address}</td>
                      <td className="py-4 px-6 text-slate-300 font-semibold">{item.owner_name}</td>
                      <td className="py-4 px-6 text-amber-400 font-bold">⭐ {item.average_rating}</td>
                      <td className="py-4 px-6 text-center">
                        <a
                          href={`/stores/${item.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all text-xs font-bold"
                        >
                          <span>Manage Reviews</span>
                          <FaArrowRight />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* --- ADD USER MODAL --- */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h3 className="text-xl font-extrabold text-white">Add New User</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-700 rounded-lg transition-all"
              >
                <FaTimes size={18} />
              </button>
            </div>
            <form onSubmit={handleAddUserSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-slate-300 text-xs uppercase tracking-wider font-bold mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Min 20, Max 60 characters"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 outline-none text-white text-sm px-4 py-3 rounded-xl focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-xs uppercase tracking-wider font-bold mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 outline-none text-white text-sm px-4 py-3 rounded-xl focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-xs uppercase tracking-wider font-bold mb-2">Address</label>
                <textarea
                  placeholder="Max 400 characters"
                  rows={2}
                  value={userForm.address}
                  onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 outline-none text-white text-sm px-4 py-3 rounded-xl focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-xs uppercase tracking-wider font-bold mb-2">Password</label>
                <input
                  type="password"
                  placeholder="8-16 chars, 1 uppercase, 1 special char"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 outline-none text-white text-sm px-4 py-3 rounded-xl focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-xs uppercase tracking-wider font-bold mb-2">Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 outline-none text-white text-sm px-4 py-3 rounded-xl focus:border-indigo-500 transition-all font-semibold"
                >
                  <option value="user">Normal User</option>
                  <option value="admin">Administrator</option>
                  <option value="owner">Store Owner</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="w-1/2 py-3 rounded-xl text-slate-300 bg-slate-900 hover:bg-slate-750 font-bold transition-all border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 font-bold transition-all shadow-lg shadow-indigo-600/30"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD STORE MODAL --- */}
      {showAddStoreModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h3 className="text-xl font-extrabold text-white">Add New Store</h3>
              <button
                onClick={() => setShowAddStoreModal(false)}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-700 rounded-lg transition-all"
              >
                <FaTimes size={18} />
              </button>
            </div>
            <form onSubmit={handleAddStoreSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-slate-300 text-xs uppercase tracking-wider font-bold mb-2">Store Name</label>
                <input
                  type="text"
                  placeholder="Enter store name"
                  value={storeForm.name}
                  onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 outline-none text-white text-sm px-4 py-3 rounded-xl focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-xs uppercase tracking-wider font-bold mb-2">Store Email</label>
                <input
                  type="email"
                  placeholder="Enter store email"
                  value={storeForm.email}
                  onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 outline-none text-white text-sm px-4 py-3 rounded-xl focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-xs uppercase tracking-wider font-bold mb-2">Address</label>
                <textarea
                  placeholder="Max 400 characters"
                  rows={2.5}
                  value={storeForm.address}
                  onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 outline-none text-white text-sm px-4 py-3 rounded-xl focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-xs uppercase tracking-wider font-bold mb-2">Assign Store Owner</label>
                {loadingOwners ? (
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold py-3 text-sm">
                    <FaSpinner className="animate-spin" />
                    <span>Loading owners list...</span>
                  </div>
                ) : (
                  <select
                    value={storeForm.owner_id}
                    onChange={(e) => setStoreForm({ ...storeForm, owner_id: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 outline-none text-white text-sm px-4 py-3 rounded-xl focus:border-indigo-500 transition-all font-semibold"
                  >
                    <option value="">Select a Store Owner...</option>
                    {ownersList.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name} ({owner.email})
                      </option>
                    ))}
                  </select>
                )}
                {ownersList.length === 0 && !loadingOwners && (
                  <p className="text-amber-400 text-xs font-semibold mt-1.5">
                    ⚠️ No owners found. Add a user with role "Store Owner" first.
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddStoreModal(false)}
                  className="w-1/2 py-3 rounded-xl text-slate-300 bg-slate-900 hover:bg-slate-750 font-bold transition-all border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingOwners || ownersList.length === 0}
                  className="w-1/2 py-3 rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30"
                >
                  Create Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- USER DETAIL MODAL --- */}
      {showUserDetailModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h3 className="text-xl font-extrabold text-white">User Details Card</h3>
              <button
                onClick={() => setShowUserDetailModal(false)}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-700 rounded-lg transition-all"
              >
                <FaTimes size={18} />
              </button>
            </div>
            <div className="p-6">
              {loadingDetail ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <FaSpinner className="text-indigo-500 animate-spin text-3xl" />
                  <span className="text-slate-400 text-sm font-semibold">Fetching user profile...</span>
                </div>
              ) : selectedUserDetail ? (
                <div className="space-y-6">
                  
                  {/* Basic information */}
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl">
                      <FaUsers className="text-3xl" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white leading-tight">{selectedUserDetail.name}</h4>
                      <p className="text-slate-400 text-sm font-mono mt-1">{selectedUserDetail.email}</p>
                    </div>
                  </div>

                  <hr className="border-slate-700" />

                  {/* Profile data list */}
                  <div className="grid grid-cols-3 gap-y-4 text-sm">
                    <div className="text-slate-450 font-bold uppercase text-xs text-slate-400">Role</div>
                    <div className="col-span-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          selectedUserDetail.role === "admin"
                            ? "bg-red-500/10 text-red-400"
                            : selectedUserDetail.role === "owner"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {selectedUserDetail.role === "admin" ? "Administrator" : selectedUserDetail.role === "owner" ? "Store Owner" : "Normal User"}
                      </span>
                    </div>

                    <div className="text-slate-450 font-bold uppercase text-xs text-slate-400">Address</div>
                    <div className="col-span-2 text-slate-300 leading-relaxed font-semibold">
                      {selectedUserDetail.address || "N/A"}
                    </div>
                  </div>

                  {/* If user is owner: show store and rating stats */}
                  {selectedUserDetail.role === "owner" && (
                    <>
                      <hr className="border-slate-700" />
                      <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-750 space-y-3">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                          <FaStore />
                          <span>Owned Store Performance</span>
                        </div>
                        {selectedUserDetail.store ? (
                          <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Store Name:</span>
                              <span className="text-white font-semibold">{selectedUserDetail.store.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Store Email:</span>
                              <span className="text-slate-300 font-mono text-xs">{selectedUserDetail.store.email}</span>
                            </div>
                            <div className="flex justify-between items-center pt-1 border-t border-slate-850">
                              <span className="text-slate-450 text-slate-400">Average Rating:</span>
                              <span className="text-yellow-400 font-bold text-base flex items-center gap-1">
                                ⭐ {selectedUserDetail.average_rating || 0}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-500 font-medium text-xs">
                            This owner has not been assigned a store yet. Go to "Stores List" and add a store for them.
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="pt-4">
                    <button
                      onClick={() => setShowUserDetailModal(false)}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-750 text-white font-bold rounded-xl transition-all border border-slate-700"
                    >
                      Close Card
                    </button>
                  </div>

                </div>
              ) : (
                <div className="text-center py-6 text-slate-400">No profile found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
