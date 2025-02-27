import axios from "axios";

const API_URL = "https://optima-api.onrender.com/api/auth";

export async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Invalid credentials";
  }
}

export async function signup(firstName, lastName, email, password, role = "helper") {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      firstName,
      lastName,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Email already exists";
  }
}

export async function sendingCode(email) {
  try {
    const response = await axios.post(`${API_URL}/send-code`, { email });
    return response.data.message;
  } catch (error) {
    throw error.response?.data?.message || "Invalid email";
  }
}

export async function verifyCode(email, code) {
  try {
    const response = await axios.post(`${API_URL}/verify-code`, { email, code });
    return response.data.message;
  } catch (error) {
    throw error.response?.data?.message || "Invalid code";
  }
}

export async function resetPassword(email, password) {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, {
      email,
      newPassword: password,
    });
    return response.data.message;
  } catch (error) {
    throw error.response?.data?.message || "Invalid password";
  }
}