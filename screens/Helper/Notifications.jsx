import { StyleSheet, View, Platform } from "react-native";
import NotificationsContent from "../../components/helper/Notifications/NotificationsContent";

const Notifications = () => {
  return (
    <View style={styles.container}>
      <NotificationsContent />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: Platform.OS === "android" ? "center" : null,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 60 : 0,
  },
});
