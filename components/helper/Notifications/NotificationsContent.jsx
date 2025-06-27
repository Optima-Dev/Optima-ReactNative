import { useState } from "react";
import { Text, View, StyleSheet, Platform } from "react-native";
import NotificationsBar from "./NotificationsBar";
import Colors from "../../../constants/Colors";
import HelpRequests from "./HelpRequests";
import FriendRequests from "./FriendRequests";

function NotificationsContent() {
  const [isAskingForHelp, setIsAskingForHelp] = useState(false);
  const [activeTab, setActiveTab] = useState("Help Requests");
  return (
    <View style={styles.container}>
      <View style={styles.headerText}>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <NotificationsBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "Help Requests" ? (
        <HelpRequests isAskingForHelp={isAskingForHelp} />
      ) : (
        <FriendRequests />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: Platform.OS === "android" ? "center" : null,
    paddingHorizontal: Platform.OS === "android" ? 0 : 20,
  },
  headerText: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: Platform.OS === "android" ? 28 : 30,
    fontWeight: "bold",
    color: Colors.MainColor,
    fontWeight: "700",
  },
});

export default NotificationsContent;