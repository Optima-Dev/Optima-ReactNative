import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Octicons } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import EditFriendsModal from "./EditFriendsModal";
import { editFriend, removeFriend } from "../../../util/FriendsHttp";
import { useAuth } from "../../../store/AuthContext";
import { useSeeker } from "../../../store/SeekerContext";

const FriendDetails = ({
  user,
  customFirstName,
  customLastName,
  navigation,
}) => {
  const [showModal, setShowModal] = useState(false);

  const { token } = useAuth();
  const { removeFriend: deleteFriend, editFriend: updateFriend } = useSeeker();

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

      {/* Call Button */}
      <TouchableOpacity
        style={styles.callButton}
        onPress={() => setShowModal(true)}>
        <Octicons name='pencil' size={24} color={Colors.MainColor} />
      </TouchableOpacity>

      <EditFriendsModal
        visible={showModal}
        onChangeMode={(mode) => setShowModal(mode)}
        user={user}
        customFirstName={customFirstName}
        customLastName={customLastName}
        onRemove={handleRemoveUser}
        onEdit={handleEditUser}
        navigation={navigation}
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
  callButton: {
    padding: 1,
    borderBottomColor: Colors.MainColor,
    borderBottomWidth: 2,
  },
});
