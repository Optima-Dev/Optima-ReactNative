import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import NotificationItem from "./NotificationItem";

const notifications = [
  {
    id: "1",
    profileImage: require("../../../assets/Images/mingcute_user-add-line.png"), // Use actual image path
    name: "Hatoom",
    message: "wants your help via video call.",
    type: "video_call",
  },
  {
    id: "2",
    profileImage: require("../../../assets/Images/mingcute_user-add-line.png"),
    name: "Abdelsalam",
    message: "added you as a friend.",
    type: "friend_request",
  },
  {
    id: "3",
    profileImage: require("../../../assets/Images/mingcute_user-add-line.png"),
    name: "Shaun Anderson",
    message: "added you as a friend.",
    type: "accepted",
  },
  {
    id: "4",
    profileImage: require("../../../assets/Images/mingcute_user-add-line.png"),
    name: "Shaun Anderson",
    message: "added you as a friend.",
    type: "removed",
  },
  {
    id: "5",
    profileImage: require("../../../assets/Images/mingcute_user-add-line.png"),
    name: "Shaun Anderson",
    message: "added you as a friend.",
    type: "friend_request",
  },
  {
    id: "6",
    profileImage: require("../../../assets/Images/mingcute_user-add-line.png"),
    name: "Shaun Anderson",
    message: "added you as a friend.",
    type: "accepted",
  },
  {
    id: "7",
    profileImage: require("../../../assets/Images/mingcute_user-add-line.png"),
    name: "Shaun Anderson",
    message: "added you as a friend.",
    type: "removed",
  },
  {
    id: "8",
    profileImage: require("../../../assets/Images/mingcute_user-add-line.png"),
    name: "Shaun Anderson",
    message: "added you as a friend.",
    type: "friend_request",
  },
  {
    id: "9",
    profileImage: require("../../../assets/Images/mingcute_user-add-line.png"),
    name: "Shaun Anderson",
    message: "added you as a friend.",
    type: "accepted",
  },
  {
    id: "10",
    profileImage: require("../../../assets/Images/mingcute_user-add-line.png"),
    name: "Shaun Anderson",
    message: "added you as a friend.",
    type: "removed",
  }
];

const NotificationsList = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            profileImage={item.profileImage}
            name={item.name}
            message={item.message}
            type={item.type}
            onAccept={() => console.log(`${item.name} accepted`)}
            onDecline={() => console.log(`${item.name} declined`)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NotificationsList;
