import { createContext, useContext, useState } from "react";

export const SeekerContext = createContext({
  friends: [],
  setFriends: () => {},
  removeFriend: () => {},
  editFriend: () => {},
});

function SeekerProvider({ children }) {
  const [friends, setFriends] = useState([]);

  const removeFriend = (friendId) => {
    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.user._id !== friendId)
    );
  };

  const editFriend = (friendId, data) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.user._id === friendId ? { ...friend, ...data } : friend
      )
    );
  };

  const value = {
    friends,
    setFriends,
    removeFriend,
    editFriend,
  };

  return (
    <SeekerContext.Provider value={value}>{children}</SeekerContext.Provider>
  );
}

export function useSeeker() {
  return useContext(SeekerContext);
}

export default SeekerProvider;
