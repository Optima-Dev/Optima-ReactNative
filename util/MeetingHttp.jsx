import axios from "axios";

const API_URL = "https://optima-api.onrender.com/api/meetings";

// 1. Create a new meeting
export async function createMeeting(token, data) {
  try {
    const response = await axios.post(`${API_URL}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Unable to create meeting";
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

// 3. Generate access token (Twilio)
export async function generateMeetingToken(token, meetingId) {
  try {
    const response = await axios.post(
      `${API_URL}/token`,
      { meetingId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Unable to generate token";
  }
}

// 4. Reject a meeting
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

// 5. Accept a specific meeting
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

// 6. Accept first available meeting
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

// 7. Get all pending specific meetings (for helper)
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

// 8. End a meeting
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
    throw error.response?.data?.message || "Unable to end meeting";
  }
}

// 9. Seeker accepts a specific meeting
export async function acceptSpecificSeekerMeeting(token, meetingId) {
  try {
    const response = await axios.post(
      `${API_URL}/accept-specific-seeker`,
      { meetingId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Unable to accept as seeker";
  }
}
