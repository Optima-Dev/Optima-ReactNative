import { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import ForgetPassHeader from "../../Auth/ForgetPassHeader";
import MyPeopleForm from "./MyPeopleForm";
import MyPeopleList from "./MyPeopleList";
import { sendFriendRequest } from "../../../util/FriendsHttp";
import { useAuth } from "../../../store/AuthContext";
import { useUser } from "../../../store/UserContext";

function MyPeopleContent() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const { user } = useUser();

  async function handleAddPerson(personData) {
    setIsLoading(true);
    try {
      const requestBody = {
        customFirstName: user.firstName,
        customLastName: user.lastName,
        helperEmail: personData.email,
      };

      await sendFriendRequest(token, requestBody);
      console.log("Friend request sent");

      setShowForm(false);
    } catch (error) {
      alert(error);
    }
    setIsLoading(false);
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
          isLoading={isLoading}
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
