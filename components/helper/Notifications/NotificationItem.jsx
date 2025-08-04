import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import Colors from "@/constants/Colors"; // Make sure this path is correct

const NotificationItem = ({
  profileImage,
  name,
  message,
  type,
  onAccept,
  onDecline,
  status: statusType,
}) => {
  const [status, setStatus] = useState(statusType); // null, 'accepted', 'declined'

  const handleAccept = () => {
    // Prevent multiple clicks after an action is taken
    if (status === null) {
      setStatus("accepted");
      onAccept();
    }
  };

  const handleDecline = () => {
    // Prevent multiple clicks after an action is taken
    if (status === null) {
      setStatus("declined");
      onDecline();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image source={profileImage} style={styles.profileImage} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.name}>
              {name} <Text style={styles.message}>{message}</Text>
            </Text>
          </View>
        </View>

        {/* =================================================================
          THE ONLY FIX is here: The stray {" "} that was after the closing
          </View> tag has been removed. Nothing else is changed.
          =================================================================
        */}
        {type === "video_call" && status === null ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAccept}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={handleDecline}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
          </View>
        ) : type === "friend_request" && status === null ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAccept}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={handleDecline}>
              <Text style={styles.declineText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : type === "meeting_request" && status === null ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAccept}>
              <Text style={styles.buttonText}>Accept Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={handleDecline}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
          </View>
        ) : status === "accepted" ? (
          <TouchableOpacity style={styles.acceptedButton} disabled={true}>
            <Text style={styles.buttonText}>
              {type === "meeting_request" ? "Call Accepted" : "Accepted"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.removedButton} disabled={true}>
            <Text style={styles.declineText}>
              {type === "friend_request" ? "Removed" : "Declined"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// YOUR ORIGINAL STYLES (UNCHANGED)
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAEAEA",
    borderRadius: 20,
    padding: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    width: Platform.OS === "ios" ? "100%" : 360,
    marginBottom: 15,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 300,
  },
  profileImageContainer: {
    width: 53,
    height: 53,
    borderRadius: 17,
    marginRight: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    width: 220,
    paddingVertical: 2,
  },
  name: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 14,
  },
  message: {
    color: "#444",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: 6,
  },
  acceptButton: {
    backgroundColor: Colors.MainColor,
    borderRadius: 14,
    marginRight: 6,
    width: 80,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  declineButton: {
    borderColor: Colors.MainColor,
    borderWidth: 2,
    borderRadius: 14,
    width: 80,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptedButton: {
    backgroundColor: Colors.MainColor,
    width: 170,
    height: 40,
    borderRadius: 14,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
  },
  removedButton: {
    borderColor: Colors.MainColor,
    borderWidth: 2,
    width: 170,
    height: 40,
    borderRadius: 14,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  declineText: {
    color: Colors.MainColor,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default NotificationItem;
