import { View, FlatList, StyleSheet, Text } from "react-native";

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

import { useEffect } from "react";

import { useNavigation } from "@react-navigation/native";

// The component no longer needs to receive `navigation` as a prop

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

  useEffect(() => {
    fetchMeetingRequests();
  }, [token]); // Added token to dependency array for correctness

  async function fetchMeetingRequests() {
    if (!token) return; // Don't fetch if token is not available yet

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

      const videoInfo = response.data; // Find the original meeting request to get the seeker's name

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
      <FlatList
        data={allNotifications}
        keyExtractor={(item, index) =>
          `${item.notificationType}-${item._doc?._id || item._id}-${index}`
        }
        renderItem={renderNotification}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 20 }}>
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
});

export default NotificationsList;
