import { createContext, useContext, useState } from "react";

export const HelperContext = createContext({
  requests: [],
  setRequests: () => {},
  acceptFriendRequest: () => {},
  rejectFriendRequest: () => {},
});

function HelperProvider({ children }) {
  const [requests, setRequests] = useState([]);

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

  const value = {
    requests,
    setRequests,
    acceptFriendRequest,
    rejectFriendRequest,
  };

  return (
    <HelperContext.Provider value={value}>{children}</HelperContext.Provider>
  );
}

export function useHelper() {
  return useContext(HelperContext);
}

export default HelperProvider;
