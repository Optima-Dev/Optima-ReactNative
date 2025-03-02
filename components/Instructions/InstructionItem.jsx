import { View, Text, StyleSheet, Image } from "react-native";
import Colors from "../../constants/Colors";

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
    borderRadius: 22,
    padding: 15,
    backgroundColor: Colors.grey500,
  },
  stepContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.green500,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.MainColor,
    position: 'absolute',
    top: -24,
  },
  stepText: {
    color: Colors.MainColor,
    fontWeight: "600",
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 70,
    height: 70,
  },
  text: {
    color: Colors.black,
    fontSize: 18,
    lineHeight: 26,
    flexShrink: 1, // Prevents text from overflowing
  },
  innerText: {
    color: Colors.MainColor,
    fontWeight: "bold",
  },
});

export default InstructionItem;