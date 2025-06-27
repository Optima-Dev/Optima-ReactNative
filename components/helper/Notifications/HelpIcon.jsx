import React from "react";
import { View, Image, StyleSheet, Text, Platform } from "react-native";
import Colors from "../../../constants/Colors";

function HelpIcon({ isAskingForHelp }) {
  const backEffectSource = isAskingForHelp
    ? require("../../../assets/LargeImages-Backup/Ellipse 15.png")
    : require("../../../assets/LargeImages-Backup/DarkEllipse 15 (1).png");

  const iconSource = isAskingForHelp
    ? require("../../../assets/Images/ask-for-help 1.png")
    : require("../../../assets/Images/ok (1) 1.png");

  const textColor = isAskingForHelp ? Colors.MainColor : Colors.black;

  return (
    <View style={styles.container}>
      <View style={styles.contentText}>
        <Text style={[styles.contentTitle, { color: textColor }]}>
          {isAskingForHelp
            ? "Someone is asking for help!"
            : "No one is asking for help."}
        </Text>
      </View>
      <View style={styles.circle}>
        <Image
          source={require("../../../assets/Images/Ellipse 17.png")}
          style={styles.ring}
        />
        <Image
          source={require("../../../assets/Images/Ellipse 18.png")}
          style={styles.ring}
        />
        <Image source={backEffectSource} style={styles.BackEffect} />
        <Image
          source={require("../../../assets/Images/Ellipse 16.png")}
          style={styles.SolidBack}
        />
        <Image source={iconSource} style={styles.icon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "relative",
    zIndex: 1,
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  circle: {
    justifyContent: "center",
    alignItems: "center",
    width: 220,
    height: 220,
    borderRadius: 110, // Changed from '50%' to 110 to avoid warning
    backgroundColor: "white",
    position: "relative",
  },
  icon: {
    width: 160,
    height: 160,
    position: "absolute",
  },
  BackEffect: {
    position: "absolute",
    zIndex: 0,
  },
  SolidBack: {
    position: "absolute",
    zIndex: 0,
  },
  ring: {
    position: "absolute",
    zIndex: 1,
  },
  contentText: {
    marginBottom: 80,
    zIndex: 2,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
});

export default HelpIcon;
