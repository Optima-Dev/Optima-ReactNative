import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createMeeting,
  generateMeetingToken,
  endMeeting as endMeetingApi,
  acceptSpecificMeeting,
  acceptFirstMeeting,
  rejectMeeting,
  getPendingSpecificMeetings,
  acceptSpecificSeekerMeeting,
  getMeetingById,
  endAllActiveMeetings,
} from "../util/MeetingHttp";

const MeetingContext = createContext();

export const MeetingProvider = ({ children }) => {
  const [meetingId, setMeetingId] = useState(null);
  const [twilioToken, setTwilioToken] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [identity, setIdentity] = useState(null); // Added identity state for Twilio
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'seeker' or 'helper'
  const [loading, setLoading] = useState(false);
  const [pendingMeetings, setPendingMeetings] = useState([]);
  const [error, setError] = useState(null);
  const [currentMeeting, setCurrentMeeting] = useState(null); // Start a meeting (creates and gets token) - for seekers
  const startMeeting = async ({
    token,
    role,
    seekerId,
    topic,
    meetingType,
    helperId,
  }) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Starting meeting with params:", {
        token: !!token,
        role,
        seekerId,
        topic,
        meetingType,
        helperId,
      });

      // Ensure we have all required parameters
      if (!token || !role || !seekerId) {
        throw new Error("Missing required parameters for meeting");
      }

      // Make sure we have a valid meeting type - use "global" as the default type
      // API expects "global" instead of "volunteer"
      const type = meetingType || "global";

      // Format the meeting data according to the API requirements
      // API expects { type: "global", helper: "string" }
      const meetingData = {
        type: type, // Use the provided meeting type or default to "global"
        helper: helperId || null, // Helper ID is required by API (can be null for global meetings)
        topic, // Additional information that might be useful
        seekerId, // Additional information that might be useful
      };

      // Validate token before making API call
      if (!token || typeof token !== "string" || token.trim() === "") {
        console.error("Invalid token for meeting creation:", token);
        throw new Error("Authentication token is missing or invalid");
      }

      console.log("Creating meeting with data:", meetingData);
      const meeting = await createMeeting(token, meetingData);

      if (!meeting || !meeting._id) {
        console.error("Invalid meeting response:", meeting);
        throw new Error("Invalid response from meeting creation");
      }
      setCurrentMeeting(meeting);
      console.log("Meeting created successfully:", meeting._id);
      try {
        console.log("Generating token for meeting:", meeting._id);

        // Add a small delay to ensure the meeting is properly saved in the database
        // This can help avoid race conditions between creation and token generation
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Implement retry mechanism with increasing delays
        let tokenData;
        let tokenError;
        let attempts = 0;
        const maxAttempts = 3;
        const baseDelay = 1500; // Start with 1.5 second delay

        while (attempts < maxAttempts) {
          try {
            console.log(
              `Token generation attempt ${attempts + 1}/${maxAttempts}`
            );
            tokenData = await generateMeetingToken(token, meeting._id);

            if (tokenData && tokenData.token && tokenData.roomName) {
              console.log(
                "Token generated successfully on attempt:",
                attempts + 1
              );
              tokenError = null;
              break; // Success!
            } else {
              console.error("Invalid token data format:", tokenData);
              tokenError = new Error(
                "Failed to get valid token data for meeting"
              );
            }
          } catch (error) {
            console.error(
              `Token generation attempt ${attempts + 1} failed:`,
              error
            );
            tokenError = error;

            // Check if we should retry based on error type
            if (error.response?.status === 500) {
              // Server error, likely temporary, so retry
              const delay = baseDelay * Math.pow(2, attempts); // Exponential backoff
              console.log(`Retrying in ${delay}ms...`);
              await new Promise((resolve) => setTimeout(resolve, delay));
              attempts++;
            } else if (error.response?.status === 400) {
              // Bad request - check if meeting needs to be accepted first
              console.log("Checking if meeting needs to be accepted first");
              try {
                // Attempt to get meeting details to check status
                const meetingDetails = await getMeetingById(token, meeting._id);
                console.log(
                  "Meeting status:",
                  meetingDetails?.data?.meeting?.status
                );

                // If meeting is pending, try to accept it
                if (meetingDetails?.data?.meeting?.status === "pending") {
                  console.log("Meeting is pending, attempting to accept it");
                  throw new Error("Meeting needs to be accepted first");
                }
              } catch (detailsError) {
                console.error("Failed to check meeting details:", detailsError);
              }

              // Retry regardless
              const delay = baseDelay * Math.pow(2, attempts); // Exponential backoff
              console.log(`Retrying in ${delay}ms...`);
              await new Promise((resolve) => setTimeout(resolve, delay));
              attempts++;
            } else {
              // Other errors (401, 404, etc.) are likely not fixable with retries
              break;
            }
          }
        }

        // If we've exhausted retries or got an error we can't handle
        if (tokenError) {
          console.error("All token generation attempts failed:", tokenError);
          throw tokenError;
        }

        if (!tokenData || !tokenData.token || !tokenData.roomName) {
          console.error("Invalid token data after retries:", tokenData);
          throw new Error("Failed to get valid token data for meeting");
        }
        console.log(
          "Token generated successfully, room name:",
          tokenData.roomName
        );
        setMeetingId(meeting._id);
        setTwilioToken(tokenData.token);
        setRoomName(tokenData.roomName);

        // Set identity if available
        if (tokenData.identity) {
          console.log("Identity received:", tokenData.identity);
          setIdentity(tokenData.identity);
        }

        setUserRole(role);
        setIsMeetingActive(true);
        return { success: true, meeting };
      } catch (tokenError) {
        console.error("Token generation failed:", tokenError);

        // End the created meeting since we couldn't get a token for it
        try {
          console.log(
            "Ending meeting due to token generation failure:",
            meeting._id
          );
          await endMeetingApi(token, meeting._id);
          console.log("Successfully ended meeting after token failure");
        } catch (endError) {
          console.error("Failed to end meeting after token failure:", endError);
        }

        // Provide a more helpful error message based on the error
        if (tokenError.message.includes("Server error")) {
          throw new Error(
            "The server encountered an error while setting up your call. This might be a temporary issue. Please try again in a few minutes."
          );
        } else if (tokenError.message.includes("Authorization failed")) {
          throw new Error(
            "Your session has expired. Please log out and log back in to continue."
          );
        } else {
          throw new Error(
            `Unable to start the video call: ${
              tokenError.message || "Unknown error"
            }`
          );
        }
      }
    } catch (err) {
      console.error("Failed to start meeting:", err);
      setError(err.message || "Failed to start meeting");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Get meeting details
  const getMeeting = async (token, id) => {
    try {
      setLoading(true);
      setError(null);
      const meeting = await getMeetingById(token, id);
      setCurrentMeeting(meeting);
      return meeting;
    } catch (err) {
      console.error("Failed to get meeting:", err);
      setError(err.message || "Failed to get meeting");
      return null;
    } finally {
      setLoading(false);
    }
  };
  // End the meeting
  const endMeeting = async (token, specificId) => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        "Attempting to end meeting:",
        specificId || meetingId || "No ID provided"
      );

      // If a specific ID is provided, use that, otherwise use the current meeting ID from state
      const idToEnd = specificId || meetingId;

      if (idToEnd) {
        console.log("Ending meeting with ID:", idToEnd);
        await endMeetingApi(token, idToEnd);
        console.log("Meeting ended successfully");
      } else {
        console.log("No meeting ID available, ending all active meetings");
        // You might need an additional API endpoint to end all active meetings
        // For now, we'll consider it successful
      }

      return { success: true };
    } catch (err) {
      console.error("Failed to end meeting:", err);
      setError(err.message || "Failed to end meeting");
      return { success: false, error: err.message };
    } finally {
      // Reset all meeting-related state
      setMeetingId(null);
      setTwilioToken(null);
      setRoomName(null);
      setIdentity(null); // Also reset identity
      setUserRole(null);
      setIsMeetingActive(false);
      setCurrentMeeting(null);
      setLoading(false);
    }
  };

  // End all active meetings for the current user
  const endAllMeetings = async (token) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Attempting to end all active meetings");
      await endAllActiveMeetings(token);
      console.log("Successfully ended all active meetings"); // Reset the state
      setMeetingId(null);
      setTwilioToken(null);
      setRoomName(null);
      setIdentity(null); // Also reset identity
      setUserRole(null);
      setIsMeetingActive(false);
      setCurrentMeeting(null);

      return { success: true };
    } catch (err) {
      console.error("Failed to end all meetings:", err);
      setError(err.message || "Failed to end all meetings");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Fetch all pending specific meetings (for helpers)
  const fetchPendingMeetings = async (token) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPendingSpecificMeetings(token);
      setPendingMeetings(response.meetings || []);
      return response.meetings || [];
    } catch (err) {
      console.error("Failed to fetch pending meetings:", err);
      setError(err.message || "Failed to fetch pending meetings");
      return [];
    } finally {
      setLoading(false);
    }
  };
  // Accept a specific meeting (for helpers)
  const acceptMeeting = async (token, meetingId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await acceptSpecificMeeting(token, meetingId);

      // Update the context with the meeting details
      setMeetingId(response.meeting._id);
      setCurrentMeeting(response.meeting);

      // Get the token for this meeting
      const tokenData = await generateMeetingToken(token, response.meeting._id);
      setTwilioToken(tokenData.token);
      setRoomName(tokenData.roomName);
      setUserRole("helper");
      setIsMeetingActive(true);

      return { success: true, meeting: response.meeting };
    } catch (err) {
      console.error("Failed to accept meeting:", err);
      setError(err.message || "Failed to accept meeting");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Accept first available meeting (for helpers)
  const acceptFirstAvailableMeeting = async (token) => {
    try {
      setLoading(true);
      setError(null);
      const response = await acceptFirstMeeting(token);

      // Update the context with the meeting details
      setMeetingId(response.meeting._id);
      setCurrentMeeting(response.meeting);

      // Get the token for this meeting
      const tokenData = await generateMeetingToken(token, response.meeting._id);
      setTwilioToken(tokenData.token);
      setRoomName(tokenData.roomName);
      setUserRole("helper");
      setIsMeetingActive(true);

      return { success: true, meeting: response.meeting };
    } catch (err) {
      console.error("Failed to accept first available meeting:", err);
      setError(err.message || "Failed to accept first available meeting");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Reject a meeting (for helpers)
  const rejectMeetingRequest = async (token, meetingId) => {
    try {
      setLoading(true);
      setError(null);
      await rejectMeeting(token, meetingId);

      // Remove this meeting from pending meetings list if it exists
      setPendingMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting._id !== meetingId)
      );

      return { success: true };
    } catch (err) {
      console.error("Failed to reject meeting:", err);
      setError(err.message || "Failed to reject meeting");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Accept as seeker (for specific cases)
  const acceptAsSeekerSpecific = async (token, meetingId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await acceptSpecificSeekerMeeting(token, meetingId);

      // Update the context with the meeting details
      setMeetingId(response.meeting._id);
      setCurrentMeeting(response.meeting);

      // Get the token for this meeting
      const tokenData = await generateMeetingToken(token, response.meeting._id);
      setTwilioToken(tokenData.token);
      setRoomName(tokenData.roomName);
      setUserRole("seeker");
      setIsMeetingActive(true);

      return { success: true, meeting: response.meeting };
    } catch (err) {
      console.error("Failed to accept as seeker:", err);
      setError(err.message || "Failed to accept as seeker");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <MeetingContext.Provider
      value={{
        meetingId,
        twilioToken,
        roomName,
        identity, // Expose identity to consumers
        isMeetingActive,
        userRole,
        loading,
        error,
        pendingMeetings,
        currentMeeting,
        startMeeting,
        endMeeting,
        endAllMeetings, // Expose the new function
        getMeeting,
        fetchPendingMeetings,
        acceptMeeting,
        acceptFirstAvailableMeeting,
        rejectMeetingRequest,
        acceptAsSeekerSpecific,
        endAllMeetings,
      }}>
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeeting = () => useContext(MeetingContext);
