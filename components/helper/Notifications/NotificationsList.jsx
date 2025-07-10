import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import NotificationItem from "./NotificationItem";
import { useHelper } from "../../../store/HelperContext";
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "../../../util/FriendsHttp";
import {
  acceptSpecificMeeting,
  rejectMeeting,
  getPendingSpecificMeetings,
} from "../../../util/MeetingHttp";
import { useAuth } from "../../../store/AuthContext";
import Colors from "../../../constants/Colors";

const NotificationsList = () => {
  const navigation = useNavigation();
  const { token } = useAuth();
  const {
    requests = [],
    acceptFriendRequest: acceptFriendReq,
    rejectFriendRequest: rejectFriendReq,
    meetingRequests,
    setMeetingRequests,
    acceptMeetingRequest,
    rejectMeetingRequest,
  } = useHelper();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchMeetingRequests();
  }, [token]);

  async function fetchMeetingRequests() {
    if (!token) return;

    setIsRefreshing(true);
    try {
      const pendingMeetingsResponse = await getPendingSpecificMeetings(token);
      const meetingsArray = pendingMeetingsResponse.data.meetings || [];
      if (Array.isArray(meetingsArray)) {
        setMeetingRequests(meetingsArray);
      } else {
        console.error("Fetched meetings is not an array");
        setMeetingRequests([]);
      }
    } catch (error) {
      console.error("Failed to fetch meeting requests:", error);
    }
    setIsRefreshing(false);
  }

  async function handleOnAccept(friendRequestId) {
    try {
      acceptFriendReq(friendRequestId);
      await acceptFriendRequest(token, friendRequestId);
    } catch (error) {
      alert(error);
    }
  }

  async function handleonDecline(friendRequestId) {
    try {
      rejectFriendReq(friendRequestId);
      await rejectFriendRequest(token, friendRequestId);
    } catch (error) {
      alert(error);
    }
  }

  async function handleAcceptMeeting(meetingId) {
    try {
      const response = await acceptSpecificMeeting(token, meetingId);
      const videoInfo = response.data;
      const meetingDetails = meetingRequests.find(
        (m) => (m._doc?._id || m._id) === meetingId
      );
      const seekerName = meetingDetails?.seekerName || "Seeker";
      setMeetingRequests((prev) =>
        prev.filter(
          (meeting) => (meeting._doc?._id || meeting._id) !== meetingId
        )
      );
      navigation.navigate("CallScreen", { videoInfo, seekerName });
    } catch (error) {
      console.error("Failed to accept meeting:", error);
      alert("Failed to accept meeting: " + error.message);
    }
  }

  async function handleRejectMeeting(meetingId) {
    try {
      await rejectMeeting(token, meetingId);
      rejectMeetingRequest(meetingId);
      setMeetingRequests((prev) =>
        prev.filter(
          (meeting) => (meeting._doc?._id || meeting._id) !== meetingId
        )
      );
    } catch (error) {
      alert("Failed to reject meeting: " + error);
    }
  }

  function renderRequest({ item }) {
    const id = item._doc?._id || item._id;
    const formattedItem = {
      profileImage: require("../../../assets/Images/ion_person-outline.png"),
      name: `${item.firstName} ${item.lastName}`,
      message: "sent you a friend request.",
      type: "friend_request",
      status: item.status || null,
    };
    return (
      <NotificationItem
        {...formattedItem}
        onAccept={() => handleOnAccept(id)}
        onDecline={() => handleonDecline(id)}
      />
    );
  }

  function renderMeetingRequest({ item }) {
    const meetingId = item._doc?._id || item._id;
    const formattedItem = {
      profileImage: require("../../../assets/Images/ion_person-outline.png"),
      name: item.seekerName || "Someone",
      message: "wants to have a call with you.",
      type: "meeting_request",
      status: item.status || null,
    };
    return (
      <NotificationItem
        {...formattedItem}
        onAccept={() => handleAcceptMeeting(meetingId)}
        onDecline={() => handleRejectMeeting(meetingId)}
      />
    );
  }

  const allNotifications = [
    ...(Array.isArray(requests) ? requests : []).map((item) => ({
      ...item,
      notificationType: "friend_request",
    })),
    ...(Array.isArray(meetingRequests) ? meetingRequests : []).map((item) => ({
      ...item,
      notificationType: "meeting_request",
    })),
  ];

  function renderNotification({ item }) {
    if (item.notificationType === "friend_request") {
      return renderRequest({ item });
    } else if (item.notificationType === "meeting_request") {
      return renderMeetingRequest({ item });
    }
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.refreshButtonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.refreshButton,
            pressed && styles.pressed,
            isRefreshing && styles.disabled,
          ]}
          onPress={fetchMeetingRequests}
          disabled={isRefreshing}
          accessibilityLabel='Refresh notifications'>
          {isRefreshing ? (
            <ActivityIndicator
              size='small'
              color={Colors.MainColor || "#007AFF"}
            />
          ) : (
            <Ionicons
              name='refresh'
              size={24}
              color={Colors.MainColor || "#007AFF"}
            />
          )}
        </Pressable>
      </View>
      <FlatList
        data={allNotifications}
        keyExtractor={(item, index) =>
          `${item.notificationType}-${item._doc?._id || item._id}-${index}`
        }
        renderItem={renderNotification}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No new notifications.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  refreshButtonContainer: {
    position: "absolute",
    top: -180,
    right: -90,
    zIndex: 1, // Ensure button is above FlatList
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.grey100 || "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  emptyContainer: {
    alignItems: "center",
  },
});

export default NotificationsList;
