import { View, Text, StyleSheet, Image } from "react-native";

function InstructionItem({ step, text, ImgSource }) {
  return (
    <View style={styles.card}>
      {/* Step Number */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepText}>{step}</Text>
      </View>

      {/* Icon and Text */}
      <View style={styles.textContainer}>
        <Image source={ImgSource} style={styles.icon} />
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  stepContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#264de4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "#333",
    fontSize: 14,
    flexShrink: 1, // Prevents text from overflowing
  },
});

export default InstructionItem;