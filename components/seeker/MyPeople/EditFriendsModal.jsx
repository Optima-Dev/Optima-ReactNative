import { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import Colors from "../../../constants/Colors";
import MyPeopleFormInputs from "./MyPeopleFormInputs";
import PrimaryButton from "../../UI/PrimaryButton";
import { validateEmail, validateName } from "../../../util/Validation";
import { createMeeting } from "../../../util/MeetingHttp";
import { useAuth } from "../../../store/AuthContext";

// ===================================================================
// STEP 1: Import the useNavigation hook
// ===================================================================
import { useNavigation } from "@react-navigation/native";

const EditFriendsModal = ({
  visible,
  user,
  customFirstName,
  customLastName,
  onChangeMode,
  onRemove,
  onEdit,
  // The 'navigation' prop is no longer needed from the parent
}) => {
  // ===================================================================
  // STEP 2: Get the navigation object directly using the hook
  // ===================================================================
  const navigation = useNavigation();

  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [editFriendData, setEditFriendData] = useState({
    firstName: customFirstName,
    lastName: customLastName,
    email: user.email,
  });
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  function handleChangeInputs(key, value) {
    setEditFriendData((prevState) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  }

  async function handleRemoveFriend() {
    setIsLoading(true);
    await onRemove(user._id);
    setIsLoading(false);
  }

  async function handleEditFriend() {
    const isFirstName = validateName(editFriendData.firstName);
    const isLastName = validateName(editFriendData.lastName);
    const isEmail = validateEmail(editFriendData.email);

    if (!(isFirstName || isLastName || isEmail)) {
      setIsEditing(true);
      const bodyRequest = {
        customFirstName: editFriendData.firstName,
        customLastName: editFriendData.lastName,
      };
      await onEdit(user._id, bodyRequest);
      setIsEditing(false);
    } else {
      setError({
        firstName: isFirstName,
        lastName: isLastName,
        email: isEmail,
      });
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

      // Close the modal first
      onChangeMode(false);

      if (!response?.data) {
        throw new Error("Invalid meeting response");
      }

      // This call will now work perfectly because `navigation` is defined.
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
      alert("Failed to send call request. Please try again.");
    } finally {
      setIsCalling(false);
    }
  }

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={() => onChangeMode(!visible)}>
      <Pressable
        style={styles.modalOverlay}
        onPress={() => onChangeMode(!visible)}
      />
      <View style={styles.modalContainer}>
        <View style={styles.avatarConatiner}>
          <Text style={styles.avatarText}>
            {customFirstName[0].toUpperCase() + customLastName[0].toUpperCase()}
          </Text>
        </View>
        <Text
          style={styles.name}>{`${customFirstName} ${customLastName}`}</Text>
        <MyPeopleFormInputs
          form={editFriendData}
          onChange={handleChangeInputs}
          isEditing={isEditing}
          error={error}
          disabled
        />
        <View style={styles.ButtonsContainer}>
          <PrimaryButton
            backgroundColor={"white"}
            textColor={Colors.MainColor}
            style={{ borderWidth: 4 }}
            title='Save'
            onPress={handleEditFriend}
            isLoading={isEditing}
          />
          <PrimaryButton
            backgroundColor={Colors.MainColor}
            textColor={Colors.white}
            title='Call'
            onPress={handleCallFriend}
            isLoading={isCalling}
          />
          <PrimaryButton
            backgroundColor={Colors.red600}
            textColor={Colors.white}
            title='Remove'
            onPress={handleRemoveFriend}
            isLoading={isLoading}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    height: "40%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContainer: {
    flex: 1,
    alignItems: Platform.OS === "android" ? "center" : null,
    backgroundColor: Colors.white,
    paddingHorizontal: 50,
    borderRadius: 35,
    marginTop: -75,
  },
  avatarConatiner: {
    backgroundColor: Colors.MainColor,
    width: 108,
    height: 108,
    borderRadius: 54,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: -54,
    marginBottom: 12,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 40,
    fontWeight: "600",
    letterSpacing: 4,
  },
  name: {
    color: Colors.MainColor,
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
  },
  InputsContainer: {
    marginBottom: 20,
    gap: 8,
  },
  ButtonsContainer: {
    marginTop: 14,
    gap: 10,
  },
});

export default EditFriendsModal;
