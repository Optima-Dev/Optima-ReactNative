import { Text, StyleSheet, Pressable, Image, Platform } from "react-native";
import Colors from "@/constants/Colors";

function DetailItem({ text, iconSource, backgroundColor, onPress }) {

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed, { backgroundColor }]}
    >
      <Text style={styles.text}>{text}</Text>
      <Image source={iconSource} style={styles.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  text: {
    color: Colors.MainColor, // Blue text color
    fontSize: Platform.OS === "ios" ? 22 : 18,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.6, // Add slight fade effect when pressed
  },
});

export default DetailItem;
