import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import Colors from "@/constants/Colors";

const NotificationItem = ({
  profileImage,
  name,
  message,
  type,
  onAccept,
  onDecline,
}) => {
  const [status, setStatus] = useState(null); // null, 'accepted', 'declined'
  const AcceptStyle =
    status === "accepted" ? styles.acceptedButton : styles.acceptButton;
  const DeclineStyle =
    status === "accepted" ? styles.removedButton : styles.declineButton;

  const handleAccept = () => {
    setStatus("accepted");
    if (onAccept) {
      onAccept();
    }
  };

  const handleDecline = () => {
    setStatus("declined");
    if (onDecline) {
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
        {type === "video_call" && status === null ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAccept}>
              <Text style={[styles.buttonText, { AcceptStyle }]}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={handleDecline}>
              <Text style={[styles.declineText, { DeclineStyle }]}>
                Decline
              </Text>
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
        ) : status === "accepted" ? (
          <TouchableOpacity style={styles.acceptedButton}>
            <Text style={styles.buttonText}>Accepted</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.removedButton}>
            <Text style={styles.declineText}>Removed</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

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
    width: Platform.OS === "ios" ? '100%' : 360,
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
