import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import NotificationItem from "./NotificationItem";
import { getFriendRequests } from "../../../util/FriendsHttp";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await getFriendRequests(token);
        setNotifications(response);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        alert(
          "Failed to fetch notifications: " + (error.message || "Unknown error")
        );
      }
      setIsLoading(false);
    }

    fetchNotifications();
  }, []);
  console.log(notifications.friendRequests);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='blue' />
      </View>
    );
  }

  const formattedNotifications = notifications.friendRequests
    ? notifications.friendRequests.map((request) => ({
        id: request._id,
        profileImage: require("../../../assets/Images/ion_person-outline.png"),
        name: `${request.customFirstName} ${request.customLastName}`,
        message: "sent you a friend request.",
        type: "friend_request",
      }))
    : [];

  function renderRequest({ item }) {
    return (
      <NotificationItem
        profileImage={item.profileImage}
        name={item.name}
        message={item.message}
        type={item.type}
        onAccept={() => console.log(`${item.name} accepted`)}
        onDecline={() => console.log(`${item.name} declined`)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={formattedNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderRequest}
        ListEmptyComponent={<Text>No notifications found.</Text>}
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
