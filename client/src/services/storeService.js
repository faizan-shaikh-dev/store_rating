import api from "./api";

// Get All Stores with search and sorting params
export const getAllStores = async (params) => {
  const response = await api.get("/store", { params });
  return response.data;
};

// Get Single Store details
export const getStoreById = async (id) => {
  const response = await api.get(`/store/${id}`);
  return response.data;
};

// Get Store Owner Dashboard stats and review list
export const getOwnerDashboard = async () => {
  const response = await api.get("/store/owner/dashboard");
  return response.data;
};
