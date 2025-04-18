import { View, Text, FlatList, StyleSheet, Platform } from "react-native";
import PrimaryButton from "../../UI/PrimaryButton";
import Colors from "../../../constants/Colors";
import FriendDetails from "./FriendDetails";
import { useSeeker } from "../../../store/SeekerContext";

function MyPeopleList({ onShowForm }) {
  const { friends } = useSeeker();

  console.log(friends);
  function renderFriend({ item }) {
    return <FriendDetails {...item} />;
  }

  return (
    <View style={styles.container}>
      <PrimaryButton
        title='Add New Member'
        onPress={onShowForm}
        backgroundColor={Colors.MainColor}
        textColor={"white"}
      />

      {friends.length > 0 ? (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.user._id}
          renderItem={renderFriend}
          style={{ marginTop: 15 }}
        />
      ) : (
        <Text style={styles.noBodyPhrase}>
          There is no one in the list at the current time.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === "ios" ? 0 : 16,
    marginVertical: Platform.OS === "ios" ? 22 : 0,
  },
  noBodyPhrase: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.gray200,
    marginTop: 30,
    fontWeight: "bold",
  },
});

export default MyPeopleList;
