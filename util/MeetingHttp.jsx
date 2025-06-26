import axios from "axios";

const API_URL = "https://optima-api.onrender.com/api/meetings";

// 1. Create a new meeting
export async function createMeeting(token, data) {
  try {
    // API expects { type: "global", helper: "string" } which is data here
    const requestBody = {
      type: data.type,
      helper: data.helperId || null, // Helper ID or null if it's a volunteer meeting
    };

    const response = await axios.post(`${API_URL}`, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Unable to create meeting";
  }
}

// 2. Get meeting details by ID
export async function getMeetingById(token, id) {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Unable to fetch meeting";
  }
}

// 3. Reject a meeting
export async function rejectMeeting(token, meetingId) {
  try {
    const response = await axios.post(
      `${API_URL}/reject`,
      { meetingId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Unable to reject meeting";
  }
}

// 4. Accept a specific meeting
export async function acceptSpecificMeeting(token, meetingId) {
  try {
    const response = await axios.post(
      `${API_URL}/accept-specific`,
      { meetingId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Unable to accept meeting";
  }
}

// 5. Accept first available meeting
export async function acceptFirstMeeting(token) {
  try {
    const response = await axios.post(
      `${API_URL}/accept-first`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Unable to accept first meeting";
  }
}

// 6. Get all pending specific meetings (for helper)
export async function getPendingSpecificMeetings(token) {
  try {
    const response = await axios.get(`${API_URL}/pending-specific`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Unable to fetch pending meetings";
  }
}

// 7. End a meeting
export async function endMeeting(token, meetingId) {
  try {
    const response = await axios.post(
      `${API_URL}/end`,
      { meetingId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Unable to end meeting";
  }
}