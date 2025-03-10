import { createContext, useContext, useState } from "react";

export const FriendsContext = createContext({
  friends: [],
  setFriends: () => {},
  addFriend: () => {},
  removeFriend: () => {},
  editFriend: () => {},
  acceptFriendRequest: () => {},
  rejectFriendRequest: () => {},
});

function FriendsProvider({ children }) {
  const [friends, setFriends] = useState([]);

  const updateFriends = (newFriends) => {
    setFriends(newFriends);
  };

  const addFriend = (personData) => {
    const newFriend = {
      id: personData.userId || personData.email,
      email: personData.email,
      status: "pending",
      firstName: personData.firstName,
      lastName: personData.lastName,
    };
    setFriends((prevFriends) => [...prevFriends, newFriend]);
  };

  const removeFriend = (userId) => {
    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.id !== userId)
    );
  };

  const editFriend = (userId, data) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === userId ? { ...friend, ...data } : friend
      )
    );
  };

  const acceptFriendRequest = (userId) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === userId ? { ...friend, status: "accepted" } : friend
      )
    );
  };

  const rejectFriendRequest = (userId) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === userId ? { ...friend, status: "rejected" } : friend
      )
    );
  };

  const value = {
    friends,
    setFriends: updateFriends,
    addFriend,
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
