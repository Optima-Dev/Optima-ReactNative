import {
  View,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";
import NotificationItem from "./NotificationItem";
import { useFriends } from "../../../store/FriendsContext";
import { acceptFriendRequest, rejectFriendRequest } from "../../../util/FriendsHttp";
import { useAuth } from "../../../store/AuthContext";

const NotificationsList = () => {
  const { token } = useAuth();
  const { 
    requests,
    acceptFriendRequest: acceptFriendReq,
    rejectFriendRequest: rejectFriendReq,
  } = useFriends();


  async function handleOnAccept(friendRequestId) {
    try {
      acceptFriendReq(friendRequestId);
      await acceptFriendRequest(token, friendRequestId);
    } catch(error) {
      alert(error);
    }
  }

  async function handleonDecline(friendRequestId) {
    try {
      rejectFriendReq(friendRequestId);
      await rejectFriendRequest(token, friendRequestId);
    } catch(error) {
      alert(error);
    }
  }

  function renderRequest({ item }) {
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
        onAccept={() => handleOnAccept(item._id)}
        onDecline={() => handleonDecline(item._id)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
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
