import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { useSeeker } from "../../store/SeekerContext";

export default function FriendsList() {
  const { friends } = useSeeker();
  console.log(friends);
  return (
    <ScrollView style={styles.container}>
      {friends.map((friend) => (
        <View style={styles.friend}>
          <Text style={styles.name}>friend</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === "ios" ? 0 : 16,
    marginVertical: Platform.OS === "ios" ? 22 : 0,
    zIndex: 3,
  },
  friend: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
  },
});
