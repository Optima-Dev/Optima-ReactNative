import axios from "axios";

const API_URL = "https://optima-api.onrender.com/api/friends";

export async function getFriends(token) {
  try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Invalid token";
  }
}

export async function getFriendRequests(token) {
  try {
    const response = await axios.get(`${API_URL}/requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Invalid token";
  }
}

export async function sendFriendRequest(token, requestData) {
  try {
    const response = await axios.post(
      `${API_URL}/send`,
      requestData, // Pass the full object instead of just email
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Invalid token";
  }
}

export async function acceptFriendRequest(token, friendRequestId) {
  try {
    const response = await axios.post(
      `${API_URL}/accept`,
      { friendRequestId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Invalid token";
  }
}

export async function rejectFriendRequest(token, friendRequestId) {
  try {
    const response = await axios.post(
      `${API_URL}/reject`,
      { friendRequestId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Invalid token";
  }
}

export async function removeFriend(token, friendId) {
  try {
    const response = await axios.post(
      `${API_URL}/remove`,
      { friendId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Invalid token";
  }
}

export async function editFriend(token, data) {
  try {
    const response = await axios.put(
      `${API_URL}/edit`,
      { ...data },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    throw error.response?.data?.message || "Invalid token";
  }
}
