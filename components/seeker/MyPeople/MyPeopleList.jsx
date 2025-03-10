import { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import PrimaryButton from "../../UI/PrimaryButton";
import Colors from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useFriends } from "../../../store/FriendsContext";

function MyPeopleList({ onShowForm }) {
  const { friends } = useFriends();

  console.log(friends);

  function renderFriend({ friend }) {
    return (
      <View style={styles.personContainer}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {friend.firstName.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Name */}
        <Text
          style={styles.name}>{`${friend.firstName} ${friend.lastName}`}</Text>

        {/* Call Button */}
        <TouchableOpacity style={styles.callButton}>
          <Ionicons
            name='call-outline'
            size={Platform.OS === "ios" ? 28 : 20}
            color={Colors.MainColor}
          />
        </TouchableOpacity>
      </View>
    );
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
          keyExtractor={(friend, index) => index.toString()}
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
    padding: 8,
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
