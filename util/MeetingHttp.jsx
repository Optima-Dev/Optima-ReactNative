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

    // Try an alternative approach - retry with different body formats if first attempt fails
    let response;
    try {
      // First attempt with { meetingId } format
      response = await axios.post(
        `${API_URL}/token`,
        { meetingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000, // Set a reasonable timeout
        }
      );
    } catch (initialError) {
      console.log("Initial token request failed, trying alternative format");
      
      if (initialError.response?.status === 500) {
        // Try alternative format - some APIs expect { meeting: meetingId } or { id: meetingId }
        try {
          response = await axios.post(
            `${API_URL}/token`,
            { meeting: meetingId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              timeout: 10000,
            }
          );
          console.log("Alternative 1 token request succeeded");
        } catch (alternativeError1) {
          // Try another alternative format
          try {
            response = await axios.post(
              `${API_URL}/token`,
              { id: meetingId },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                timeout: 10000,
              }
            );
            console.log("Alternative 2 token request succeeded");
          } catch (alternativeError2) {
            // If all attempts fail, throw the original error
            throw initialError;
          }
        }
      } else {
        // If it's not a 500 error, just throw the original error
        throw initialError;
      }
    }

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
    
    // Handle response format according to the API documentation
    let twilioToken, roomName, identity;

    // Try to extract token data from various possible response formats
    // Format 1: { status: "success", data: { token: "...", roomName: "...", identity: "..." } }
    if (
      response.data?.status === "success" &&
      response.data?.data?.token &&
      response.data?.data?.roomName
    ) {
      twilioToken = response.data.data.token;
      roomName = response.data.data.roomName;
      identity = response.data.data.identity; // Capture identity if available
      console.log("Token response format matches expected structure");
    }
    // Format 2: Direct { token: "...", roomName: "..." }
    else if (response.data?.token && response.data?.roomName) {
      twilioToken = response.data.token;
      roomName = response.data.roomName;
      identity = response.data?.identity;
      console.log("Using fallback token response format 1");
    }
    // Format 3: { data: { token: "...", roomName: "..." } }
    else if (response.data?.data?.token && response.data?.data?.roomName) {
      twilioToken = response.data.data.token;
      roomName = response.data.data.roomName;
      identity = response.data.data?.identity;
      console.log("Using fallback token response format 2");
    }
    // Format 4: { twilio: { token: "...", roomName: "..." } }
    else if (response.data?.twilio?.token && response.data?.twilio?.roomName) {
      twilioToken = response.data.twilio.token;
      roomName = response.data.twilio.roomName;
      identity = response.data.twilio?.identity;
      console.log("Using fallback token response format 3 (twilio object)");
    }
    // Last resort - try to find any token and roomName in the response
    else {
      // Try to find token and roomName anywhere in the response object
      const findInObject = (obj, key) => {
        if (!obj || typeof obj !== 'object') return undefined;
        if (key in obj) return obj[key];
        
        for (const k in obj) {
          const found = findInObject(obj[k], key);
          if (found !== undefined) return found;
        }
        return undefined;
      };
      
      twilioToken = findInObject(response.data, 'token');
      roomName = findInObject(response.data, 'roomName') || findInObject(response.data, 'room');
      identity = findInObject(response.data, 'identity');
      
      if (twilioToken && roomName) {
        console.log("Found token and room using deep search");
      } else {
        console.error("Invalid token response format:", response.data);
        throw new Error("Invalid token response from server");
      }
    }

    // Create a properly formatted response
    const formattedResponse = {
      token: twilioToken,
      roomName: roomName,
      identity: identity || null, // Include identity if available
    };
    
    console.log("Formatted token response:", {
      token: twilioToken ? `${twilioToken.substring(0, 20)}...` : null,
      roomName: roomName,
      identity: identity || null,
    });

    return formattedResponse;
  } catch (error) {
    console.error("Token generation error:", error);
    console.error(
      "Error details:",
      error.response?.data || error.message || error
    );
    
    // Check for specific server error codes
    if (error.response?.status === 500) {
      console.log("Server error (500) when generating token. This might be a backend issue.");
      
      // Get meeting details to help debug
      try {
        console.log(`Attempting to get meeting details for ID: ${meetingId}`);
        const meetingResponse = await axios.get(`${API_URL}/${meetingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Meeting details:", meetingResponse.data);
        
        // If we can get meeting details, try a direct approach to generate a token
        // This is a workaround for backend issues
        try {
          console.log("Attempting direct token generation through meeting details");
          const meetingData = meetingResponse.data;
          const roomName = meetingData.meeting?._id || meetingData._id || meetingId;
          
          // You might need to modify this based on your Twilio token generation requirements
          // This is just a placeholder for a potential alternative token generation approach
          console.log("Consider implementing direct token generation if possible");
        } catch (directTokenError) {
          console.log("Direct token generation not implemented or failed");
        }
      } catch (meetingError) {
        console.log("Failed to get meeting details:", meetingError.message);
      }
      
      throw new Error("Server error: The backend failed to generate a token. Please try again later or contact support.");
    }
    
    // Check for invalid meeting ID
    if (error.response?.status === 400 || error.response?.status === 404) {
      throw new Error("Invalid meeting ID or the meeting has ended");
    }
    
    // Handle unauthorized errors
    if (error.response?.status === 401) {
      throw new Error("Authorization failed. Please log in again.");
    }
    
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
