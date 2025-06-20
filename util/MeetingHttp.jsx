import axios from "axios";

const API_URL = "https://optima-api.onrender.com/api/meetings";

// 1. Create a new meeting
export async function createMeeting(token, data) {
  try {
    // Validate that we have a valid meeting type
    if (!data.type) {
      throw new Error("Invalid meeting type");
    }

    // Format the request body according to the API requirements
    // API expects { type: "global", helper: "string" }
    const requestBody = {
      type: data.type,
      helper: data.helper || null, // Helper ID or null if it's a volunteer meeting
    };

    console.log("Creating meeting with request body:", requestBody);

    const response = await axios.post(`${API_URL}`, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Meeting creation response:", response.data);

    // Handle different possible response formats
    let meeting;

    // Format 1: { status: "success", data: { meeting: {...} } }
    if (response.data?.status === "success" && response.data?.data?.meeting) {
      meeting = response.data.data.meeting;
    }
    // Format 2: { meeting: {...} }
    else if (response.data?.meeting) {
      meeting = response.data.meeting;
    }
    // Format 3: Direct meeting object with _id property
    else if (response.data?._id) {
      meeting = response.data;
    } else {
      console.error("Invalid meeting response format:", response.data);
      throw new Error("Invalid meeting response from server");
    }

    console.log("Extracted meeting:", meeting);
    return meeting;
  } catch (error) {
    console.error("Meeting creation error:", error);
    console.error("Error details:", error.response?.data || error.message);

    // Check for active meeting error
    if (
      error.response?.data?.message?.includes("already have an active meeting")
    ) {
      throw new Error(
        "You already have an active meeting. Please end your current meeting before starting a new one."
      );
    }

    // Check specifically for meeting type errors
    if (
      error.response?.data?.message?.includes("type") ||
      error.message?.includes("type")
    ) {
      throw new Error("Invalid meeting type");
    }

    // Check for helper-related errors
    if (
      error.response?.data?.message?.includes("helper") ||
      error.message?.includes("helper")
    ) {
      throw new Error("Invalid helper ID");
    }

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
    console.log(`Generating token for meeting: ${meetingId}`);

    // Validate meeting ID
    if (!meetingId) {
      console.error("Invalid meeting ID for token generation:", meetingId);
      throw new Error("Meeting ID is required for token generation");
    }

    // Validate token
    if (!token || typeof token !== "string" || token.trim() === "") {
      console.error("Invalid authentication token for token generation");
      throw new Error("Valid authentication token is required");
    }

    // Log the outgoing request
    console.log("Sending token request to:", `${API_URL}/token`);
    console.log("With meeting ID:", meetingId);

    const response = await axios.post(
      `${API_URL}/token`,
      { meetingId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Token generation response status:", response.status);
    console.log(
      "Token generation response data:",
      JSON.stringify(response.data, null, 2)
    );

    // Check the structure of the response object
    console.log("Response data structure:", {
      isObject: typeof response.data === "object",
      hasStatus: response.data?.status !== undefined,
      hasData: response.data?.data !== undefined,
      hasToken:
        response.data?.token !== undefined ||
        response.data?.data?.token !== undefined,
      hasRoomName:
        response.data?.roomName !== undefined ||
        response.data?.data?.roomName !== undefined,
      keys: Object.keys(response.data || {}),
    });

    // Handle different possible response formats from the API
    let twilioToken, roomName;

    // Format 1: { status: "success", data: { token: "...", roomName: "..." } }
    if (
      response.data?.status === "success" &&
      response.data?.data?.token &&
      response.data?.data?.roomName
    ) {
      twilioToken = response.data.data.token;
      roomName = response.data.data.roomName;
    }
    // Format 2: { token: "...", roomName: "..." }
    else if (response.data?.token && response.data?.roomName) {
      twilioToken = response.data.token;
      roomName = response.data.roomName;
    }
    // Format 3: { data: { token: "...", roomName: "..." } }
    else if (response.data?.data?.token && response.data?.data?.roomName) {
      twilioToken = response.data.data.token;
      roomName = response.data.data.roomName;
    } else {
      console.error("Invalid token response format:", response.data);
      throw new Error("Invalid token response from server");
    }

    // Create a properly formatted response
    const formattedResponse = {
      token: twilioToken,
      roomName: roomName,
    };
    console.log("Formatted token response:", {
      token: twilioToken ? `${twilioToken.substring(0, 20)}...` : null,
      roomName: roomName,
    });

    return formattedResponse;
  } catch (error) {
    console.error("Token generation error:", error);
    console.error(
      "Error details:",
      error.response?.data || error.message || error
    );
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
    console.log(`Attempting to end meeting with ID: ${meetingId}`);

    if (!meetingId) {
      console.warn("No meeting ID provided for ending meeting");
      throw new Error("Meeting ID is required to end a meeting");
    }

    if (!token) {
      console.error("No authentication token provided for ending meeting");
      throw new Error("Authentication token is required");
    }

    const response = await axios.post(
      `${API_URL}/end`,
      { meetingId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Meeting end response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to end meeting:", error);
    console.error("Error details:", error.response?.data || error.message);
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

// 10. End all active meetings for a user
export async function endAllActiveMeetings(token) {
  try {
    console.log("Attempting to end all active meetings");

    if (!token) {
      console.error("No authentication token provided for ending meetings");
      throw new Error("Authentication token is required");
    }

    const response = await axios.post(
      `${API_URL}/end-all-active`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("End all meetings response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to end all meetings:", error);
    console.error("Error details:", error.response?.data || error.message);

    // If the endpoint doesn't exist (404), it's a graceful failure
    if (error.response?.status === 404) {
      console.log(
        "End all meetings endpoint not available, treating as success"
      );
      return { success: true, message: "No active meetings to end" };
    }

    throw error.response?.data?.message || "Unable to end all meetings";
  }
}
