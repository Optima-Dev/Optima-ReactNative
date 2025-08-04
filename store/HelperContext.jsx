import { createContext, useContext, useState } from "react";

// The default value for the context
export const HelperContext = createContext({
  requests: [],
  setRequests: () => {},
  acceptFriendRequest: () => {},
  rejectFriendRequest: () => {},
  meetingRequests: [],
  setMeetingRequests: () => {},
  acceptMeetingRequest: () => {},
  rejectMeetingRequest: () => {},
});

function HelperProvider({ children }) {
  // All useState hooks are called here at the top level, in the same order every time.
  const [requests, setRequests] = useState([]);
  const [meetingRequests, setMeetingRequests] = useState([]);

  const acceptFriendRequest = (requestId) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request._id === requestId ? { ...request, status: "accepted" } : request
      )
    );
  };

  const rejectFriendRequest = (requestId) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request._id === requestId ? { ...request, status: "declined" } : request
      )
    );
  };

  const acceptMeetingRequest = (meetingId) => {
    console.log(`Context: Accepted meeting ${meetingId}`);
  };

  const rejectMeetingRequest = (meetingId) => {
    console.log(`Context: Rejected meeting ${meetingId}`);
  };

  // The value object provided to all child components
  const value = {
    requests,
    setRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    meetingRequests,
    setMeetingRequests,
    acceptMeetingRequest,
    rejectMeetingRequest,
  };

  return (
    <HelperContext.Provider value={value}>{children}</HelperContext.Provider>
  );
}

export function useHelper() {
  return useContext(HelperContext);
}

export default HelperProvider;