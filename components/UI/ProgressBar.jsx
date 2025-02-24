import React from "react";
import { View, StyleSheet } from "react-native";
import Colors from "../../constants/Colors"; // Import Colors

export default function ProgressBar({ step }) {
  return (
    <View style={styles.progressBar}>
      <View
        style={[
          styles.segment,
          step === 1 ? styles.activeSegment : styles.inactiveSegment,
        ]}
      />
      <View
        style={[
          styles.segment,
          step === 2 ? styles.activeSegment : styles.inactiveSegment,
        ]}
      />

      <View
        style={[
          styles.segment,
          step === 3 ? styles.activeSegment : styles.inactiveSegment,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    flexDirection: "row",
    width: 350,
    height: 5,
    borderRadius: 18,
    overflow: "hidden",
    alignSelf: "center",
    marginVertical: 20,
  },
  segment: {
    flex: 1,
    marginHorizontal: 3,
    borderRadius: 5,
  },
  activeSegment: {
    backgroundColor: Colors.white, // Active segment color
  },
  inactiveSegment: {
    backgroundColor: Colors.InActiveColor, // Inactive segment color
  },
});
