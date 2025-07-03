import { createContext, useContext, useState } from "react";
import { createMeeting } from "../util/MeetingHttp";

export const SeekerContext = createContext({
  friends: [],
  setFriends: () => {},
  removeFriend: () => {},
  editFriend: () => {},
  callSpecificFriend: async (friend, navigation) => {},
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

  const callSpecificFriend = async (friend, token, navigation) => {
    try {
      console.log(`Attempting to call friend: ${friend.user._id}`);
      const response = await createMeeting(token, {
        type: "specific",
        helperId: friend.user._id,
      });

      if (!response?.data) throw new Error("Invalid meeting response");

      navigation.navigate("CallVolunteer", {
        meetingData: response.data,
        isWaiting: true,
        helperName: `${friend.customFirstName} ${friend.customLastName}`,
      });
      return true; // Indicate success
    } catch (error) {
      console.error("Failed to create specific meeting:", error);
      alert("Failed to call friend. Please try again.");
      return false; // Indicate failure
    }
  };

  const value = {
    friends,
    setFriends,
    removeFriend,
    editFriend,
    callSpecificFriend,
  };

  return (
    <SeekerContext.Provider value={value}>{children}</SeekerContext.Provider>
  );
}

export function useSeeker() {
  return useContext(SeekerContext);
}

export default SeekerProvider;
