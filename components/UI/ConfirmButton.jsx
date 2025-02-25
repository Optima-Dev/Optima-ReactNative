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
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 360,
    height: 55,
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
