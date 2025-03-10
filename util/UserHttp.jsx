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
  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update user data");
  }

  return await response.json();
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
