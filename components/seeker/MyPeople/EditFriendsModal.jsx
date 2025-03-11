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
import AuthInput from "../../Auth/AuthInput";
import MyPeopleFormInputs from "./MyPeopleFormInputs";
import PrimaryButton from "../../UI/PrimaryButton";

const EditFriendsModal = ({ visible, user, onChangeMode, onRemove }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editFriendData, setEditFriendData] = useState({
    customFirstName: user.firstName,
    customLastName: user.lastName,
    email: user.email,
  });

  function handleChangeInputs(key, value) {
    setEditFriendData((prevState) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  }

  async function hanldeRemoveFriend() {
    setIsLoading(true);
    await onRemove(user._id);
    setIsLoading(false);
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
            {user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>

        <MyPeopleFormInputs
          form={editFriendData}
          onChange={handleChangeInputs}
          disabled
        />

        <View style={styles.ButtonsContainer}>
          <PrimaryButton
            backgroundColor={Colors.MainColor}
            textColor={Colors.white}
            title='Call'
            onPress={() => {
              console.log("Call");
            }}
          />

          <PrimaryButton
            backgroundColor={Colors.red600}
            textColor={Colors.white}
            title='Remove'
            onPress={hanldeRemoveFriend}
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
    marginTop: -35,
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
