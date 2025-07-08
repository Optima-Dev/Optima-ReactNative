import { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import ForgetPassHeader from "../../Auth/ForgetPassHeader";
import MyPeopleForm from "./MyPeopleForm";
import MyPeopleList from "./MyPeopleList";
import { sendFriendRequest } from "../../../util/FriendsHttp";
import { useAuth } from "../../../store/AuthContext";

function MyPeopleContent({ navigation }) {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  async function handleAddPerson(personData) {
    setIsLoading(true);
    try {
      const requestBody = {
        customFirstName: personData.firstName,
        customLastName: personData.lastName,
        helperEmail: personData.email,
      };

      await sendFriendRequest(token, requestBody);

      setShowForm(false);
    } catch (error) {
      alert(error);
    }
    setIsLoading(false);
  }

  const Subtitle = !showForm
    ? "Create a simple way to reach to your family and friends."
    : "Add the person’s information for a faster connection.";

  // Debug subtitle prop
  console.log("[MyPeopleContent] Subtitle:", Subtitle);

  return (
    <View style={styles.container}>
      <ForgetPassHeader title="My People" subTitle={Subtitle} />
      {showForm ? (
        <MyPeopleForm
          onAddPerson={handleAddPerson}
          onHideForm={() => setShowForm(false)}
          isLoading={isLoading}
        />
      ) : (
        <MyPeopleList
          onShowForm={() => setShowForm(true)}
          navigation={navigation}
        />
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