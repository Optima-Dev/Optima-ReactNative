import axios from "axios";

const API_URL = "https://optima-api.onrender.com/api/users/me";

export async function getUser(token) {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Invalid token";
  }
}

export async function updateUser(token, data) {
  try {
    const response = await axios.put(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Invalid token";
  }
}

export async function deleteUser(token) {
  try {
    const response = await axios.delete(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Invalid token";
  }
}
