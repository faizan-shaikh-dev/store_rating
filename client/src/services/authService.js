import api from "./api";
//Login Service
export const loginUser = async (userData)=>{
    console.log(userData);
    const response = await api.post("/auth/login", userData);
    return response.data;
};


//Register Service
export const registerUser = async (userData)=>{
    // console.log(userData)
    const response = await api.post("/auth/register", userData);
    return response.data;
};

// Change Password
export const changePassword = async (passwordData) => {
  const response = await api.put("/user/update-password", passwordData);
  return response.data;
};