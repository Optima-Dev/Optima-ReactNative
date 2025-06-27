import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import Colors from "../../../constants/Colors";

function NotificationsBar({ activeTab, setActiveTab }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "Help Requests" && styles.activeTab]}
        onPress={() => setActiveTab("Help Requests")}>
        <Text
          style={[
            styles.text,
            activeTab === "Help Requests" && styles.activeText,
          ]}>
          Help Requests
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === "Friend Requests" && styles.activeTab,
        ]}
        onPress={() => setActiveTab("Friend Requests")}>
        <Text
          style={[
            styles.text,
            activeTab === "Friend Requests" && styles.activeText,
          ]}>
          Friend Requests
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.grey600,
    borderRadius: 25,
    padding: 4,
    width: Platform.OS === "android" ? "360" : null,
    zIndex: 2,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: Colors.MainColor,
  },
  text: {
    color: "#807D7D",
    fontWeight: "bold",
  },
  activeText: {
    color: "white",
  },
});

export default NotificationsBar;
