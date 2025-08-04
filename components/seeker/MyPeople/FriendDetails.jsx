import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Octicons, Ionicons } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import EditFriendsModal from "./EditFriendsModal";
import { editFriend, removeFriend } from "../../../util/FriendsHttp";
import { useAuth } from "../../../store/AuthContext";
import { useSeeker } from "../../../store/SeekerContext";
import { createMeeting } from "../../../util/MeetingHttp";
import { useNavigation } from "@react-navigation/native";

const FriendDetails = ({ user, customFirstName, customLastName }) => {
  const [showModal, setShowModal] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  const { token } = useAuth();
  const { removeFriend: deleteFriend, editFriend: updateFriend } = useSeeker();
  const navigation = useNavigation();

  async function handleRemoveUser(friendId) {
    try {
      deleteFriend(friendId);
      await removeFriend(token, friendId);
      setShowModal(false);
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  }

  async function handleEditUser(friendId, data) {
    try {
      updateFriend(friendId, data);
      await editFriend(token, friendId, data);
      setShowModal(false);
    } catch (error) {
      console.error("Error editing friend:", error);
    }
  }

  async function handleCallFriend() {
    try {
      setIsCalling(true);
      const meetingData = {
        type: "specific",
        helperId: user._id,
      };
      const response = await createMeeting(token, meetingData);

      if (!response?.data) throw new Error("Invalid meeting response");

      navigation.navigate("CallVolunteer", {
        meetingData: {
          ...response.data,
          type: "specific",
          seeker: user._id,
        },
        isWaiting: true,
        helperName: `${customFirstName} ${customLastName}`,
        helperId: user._id,
      });
    } catch (error) {
      console.error("Failed to create meeting:", error);
      alert("Failed to call friend. Please try again.");
    } finally {
      setIsCalling(false);
    }
  }

  return (
    <View style={styles.personContainer}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {customFirstName[0].toUpperCase()}
        </Text>
      </View>

      {/* Name */}
      <Text style={styles.name}>{`${customFirstName} ${customLastName}`}</Text>

      {/* Call Button or Spinner */}
      {isCalling ? (
        <View style={styles.callingContainer}>
          <ActivityIndicator size="small" color={Colors.MainColor} />
          <Text style={styles.callingText}>Calling...</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={handleCallFriend} style={styles.iconButton}>
          <Ionicons name="call" size={24} color={Colors.MainColor} />
        </TouchableOpacity>
      )}

      {/* Edit Icon */}
      <TouchableOpacity onPress={() => setShowModal(true)} style={styles.iconButton}>
        <Octicons name="pencil" size={24} color={Colors.MainColor} />
      </TouchableOpacity>

      {/* Modal */}
      <EditFriendsModal
        visible={showModal}
        onChangeMode={(mode) => setShowModal(mode)}
        user={user}
        customFirstName={customFirstName}
        customLastName={customLastName}
        onRemove={handleRemoveUser}
        onEdit={handleEditUser}
      />
    </View>
  );
};

export default FriendDetails;

const styles = StyleSheet.create({
  personContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAEAEA",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 12,
    borderWidth: 2,
    borderColor: Colors.MainColor,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#2727C473",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  name: {
    flex: 1,
    fontSize: 20,
    fontWeight: "500",
    color: Colors.MainColor,
  },
  iconButton: {
    paddingHorizontal: 6,
  },
  callingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  callingText: {
    marginLeft: 6,
    color: Colors.MainColor,
    fontSize: 14,
    fontWeight: "500",
  },
});
