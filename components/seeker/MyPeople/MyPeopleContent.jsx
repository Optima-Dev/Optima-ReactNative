import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import ForgetPassHeader from "../../Auth/ForgetPassHeader";
import MyPeopleForm from "./MyPeopleForm";
import MyPeopleList from "./MyPeopleList";
import { useFriends } from "../../../store/FriendsContext";
import { sendFriendRequest } from "../../../util/FriendsHttp";
import AsyncStorage from "@react-native-async-storage/async-storage";

function MyPeopleContent() {
  const [showForm, setShowForm] = useState(false);
  const { addFriend } = useFriends();

  // console.log("Stored Token", storedToken);

  async function handleAddPerson(personData) {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      // Prepare the request body matching the required format
      const requestBody = {
        customFirstName: personData.firstName,
        customLastName: personData.lastName,
        helperEmail: personData.email,
      };

      const response = await sendFriendRequest(token, requestBody);

      addFriend({
        id: response.userId || personData.email,
        email: personData.email,
        status: "pending",
        firstName: personData.firstName,
        lastName: personData.lastName,
      });

      setShowForm(false);
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert(
        "Failed to send friend request: " + (error.message || "Unknown error")
      );
    }
  }

  const Subtitle = !showForm
    ? "Create a simple way to reach to your family and friends."
    : "Add the person’s information for a faster connection.";

  return (
    <View style={styles.container}>
      <ForgetPassHeader title='My People' subTitle={Subtitle} />
      {showForm ? (
        <MyPeopleForm
          onAddPerson={handleAddPerson}
          onHideForm={() => setShowForm(false)}
        />
      ) : (
        <MyPeopleList onShowForm={() => setShowForm(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === "ios" ? 8 : 20,
    marginTop: Platform.OS === "ios" ? 0 : 40,
    alignItems: Platform.OS === "android" ? "center" : null,
  },
});

export default MyPeopleContent;
