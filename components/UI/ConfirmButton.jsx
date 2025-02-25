import { Pressable, Text, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

function ConfirmButton({ title, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.MainColor, // Blue color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Adjust width as needed
  },
  pressed: {
    opacity: 0.7, // Slight fade effect when pressed
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ConfirmButton;
