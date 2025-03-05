import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import NotificationsBar from "./NotificationsBar";
import Colors from "../../../constants/Colors";
import HelpRequests from "./HelpRequests";
import FriendRequests from "./FriendRequests";

function NotificationsContent() {
  const [isAskingForHelp, setIsAskingForHelp] = useState(true);
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
    alignItems: "center",
  },
  headerText: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.MainColor,
    fontWeight: "700",
  },
});

export default NotificationsContent;
