import api from "./api";

// Fetch admin dashboard statistics
export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// Fetch list of users with search, role filter, and sorting options
export const getAdminUsers = async (params) => {
  const response = await api.get("/admin/users", { params });
  return response.data;
};

// Fetch single user details (including store rating for owners)
export const getAdminUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

// Admin adds a user/admin/owner
export const addAdminUser = async (userData) => {
  const response = await api.post("/admin/users", userData);
  return response.data;
};

// Admin adds a store and assigns it to an owner
export const addAdminStore = async (storeData) => {
  const response = await api.post("/admin/stores", storeData);
  return response.data;
};

// Fetch list of stores with search and sorting options
export const getAdminStores = async (params) => {
  const response = await api.get("/admin/stores", { params });
  return response.data;
};
