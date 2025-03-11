import { createContext, useContext, useState } from "react";

export const FriendsContext = createContext({
  friends: [],
  setFriends: () => {},
  removeFriend: () => {},
  editFriend: () => {},
});

function FriendsProvider({ children }) {
  const [friends, setFriends] = useState([]);

  const updateFriends = (newFriends) => {
    setFriends(newFriends);
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

  const value = {
    friends,
    setFriends: updateFriends,
    removeFriend,
    editFriend,
  };

  return (
    <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>
  );
}

export function useFriends() {
  return useContext(FriendsContext);
}

export default FriendsProvider;
