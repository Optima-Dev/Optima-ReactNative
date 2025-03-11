import { createContext, useContext, useState } from "react";

export const FriendsContext = createContext({
  friends: [],
  requests: [],
  setRequests: () => {},
  setFriends: () => {},
  removeFriend: () => {},
  editFriend: () => {},
  acceptFriendRequest: () => {},
  rejectFriendRequest: () => {},
});

function FriendsProvider({ children }) {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);

  const removeFriend = (friendId) => {
    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.id !== friendId)
    );
  };

  const editFriend = (userId, data) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === userId ? { ...friend, ...data } : friend
      )
    );
  };

  const acceptFriendRequest = (requestId) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) => (
        request._id === requestId ? { ...request, status: "accepted" } : request
      )
    ));
  };

  const rejectFriendRequest = (requestId) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request._id === requestId ? { ...request, status: "declined" } : request
      )
    );
  };

  const value = {
    friends,
    requests,
    setFriends,
    setRequests,
    removeFriend,
    editFriend,
    acceptFriendRequest,
    rejectFriendRequest,
  };

  return (
    <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>
  );
}

export function useFriends() {
  return useContext(FriendsContext);
}

export default FriendsProvider;
