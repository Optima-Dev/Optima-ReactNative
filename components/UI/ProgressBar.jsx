import { View, StyleSheet, Platform } from "react-native";
import Colors from "@/constants/Colors"; // Import Colors

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
    borderRadius: 18,
    paddingHorizontal: 20,
  },
  segment: {
    flex: 1,
    height: 6,
    marginHorizontal: Platform.OS === "ios" ? 5 : 3,
    borderRadius: 5,
  },
  activeSegment: {
    backgroundColor: Colors.white, // Active segment color
  },
  inactiveSegment: {
    backgroundColor: Colors.InActiveColor, // Inactive segment color
  },
});
