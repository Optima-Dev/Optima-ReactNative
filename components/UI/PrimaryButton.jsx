import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import Colors from "../../constants/Colors";

function PrimaryButton({
  onPress,
  isLoading,
  title,
  backgroundColor,
  textColor,
  style,
}) {
  // Debug props
  console.log("[PrimaryButton] Props:", { backgroundColor, textColor });

  // Use black text for white background, otherwise use provided textColor or fallback
  const resolvedTextColor =
    backgroundColor === "white"
      ? Colors.black || "#000000"
      : textColor || "white";
  const buttonBackgroundColor =
    backgroundColor === "white"
      ? "white"
      : backgroundColor || Colors.MainColor || "#007AFF";

  // Determine border color: if background is Colors.red600, use same for border
  const borderColor =
    buttonBackgroundColor === Colors.MainColor || buttonBackgroundColor === "white"
      ? Colors.MainColor
      : buttonBackgroundColor;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        {
          backgroundColor: buttonBackgroundColor,
          borderColor: borderColor,
          borderWidth: 2,
        },
        style,
      ]}
      onPress={onPress}>
      <Text style={[styles.text, { color: resolvedTextColor }]}>
        {isLoading ? (
          <ActivityIndicator size='large' color={resolvedTextColor} />
        ) : (
          title
        )}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: Platform.OS === "android" ? 360 : "100%",
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

export default PrimaryButton;
