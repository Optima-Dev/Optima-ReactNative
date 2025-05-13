import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createMeeting,
  generateMeetingToken,
  endMeeting as endMeetingApi,
} from "../services/MeetingHttp"; // Adjust the path if needed

const MeetingContext = createContext();

export const MeetingProvider = ({ children }) => {
  const [meetingId, setMeetingId] = useState(null);
  const [twilioToken, setTwilioToken] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'seeker' or 'helper'
  const [loading, setLoading] = useState(false);

  // Start a meeting (creates and gets token)
  const startMeeting = async ({ token, role, seekerId, topic }) => {
    try {
      setLoading(true);
      const meeting = await createMeeting(token, { seekerId, topic });

      const tokenData = await generateMeetingToken(token, meeting.id);

      setMeetingId(meeting.id);
      setTwilioToken(tokenData.token);
      setRoomName(tokenData.roomName);
      setUserRole(role);
      setIsMeetingActive(true);
    } catch (err) {
      console.error("Failed to start meeting:", err);
    } finally {
      setLoading(false);
    }
  };

  // End the meeting
  const endMeeting = async (token) => {
    try {
      if (meetingId) {
        await endMeetingApi(token, meetingId);
      }
    } catch (err) {
      console.error("Failed to end meeting:", err);
    } finally {
      setMeetingId(null);
      setTwilioToken(null);
      setRoomName(null);
      setUserRole(null);
      setIsMeetingActive(false);
    }
  };

  return (
    <MeetingContext.Provider
      value={{
        meetingId,
        twilioToken,
        roomName,
        isMeetingActive,
        userRole,
        loading,
        startMeeting,
        endMeeting,
      }}>
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeeting = () => useContext(MeetingContext);
