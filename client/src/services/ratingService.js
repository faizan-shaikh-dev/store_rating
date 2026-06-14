import api from "./api";

// Submit rating (1 to 5) for a store
export const submitRating = async (store_id, rating) => {
  const response = await api.post("/rating", { store_id, rating });
  return response.data;
};

// Update rating for a store
export const updateRating = async (storeId, rating) => {
  const response = await api.put(`/rating/${storeId}`, { rating });
  return response.data;
};

// Get all ratings for a single store
export const getRatingsByStore = async (storeId) => {
  const response = await api.get(`/rating/store/${storeId}`);
  return response.data;
};
