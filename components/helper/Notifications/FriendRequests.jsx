import { Text, View, StyleSheet, Platform } from "react-native";
import NotificationsList from "./NotificationsList";

function FriendRequests({navigation}) {
  return (
    <View style={styles.container}>
      <NotificationsList navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: Platform.OS === "ios" ? null : 'center',
    backgroundColor: "white",
    paddingTop: 30,
  },
});

export default FriendRequests;
