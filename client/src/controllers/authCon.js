import axios from "axios";

const BASE_URL = "http://localhost:8000";
axios.defaults.withCredentials = true;
export const registerUser = async (userInfo) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userInfo);

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.error("User already exists:", error.response.data.error);
      return { success: false, error: error.response.data.error };
    } else {
      console.error("Error during user registration:", error);
      return { success: false, error: "Registration failed" };
    }
  }
};
export const loginUser = async (userInfo) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, userInfo);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error during user Login:", error);
    return { success: false, error: "Login failed" };
  }
};
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/logout`);
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("Error during user Logout:", error);
    return { success: false, error: "Logout failed" };
  }
};
