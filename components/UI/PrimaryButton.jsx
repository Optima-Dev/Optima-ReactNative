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
  const buttonBackgroundColor =
    backgroundColor === "white" ? Colors.MainColor : backgroundColor;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        { backgroundColor, borderColor: buttonBackgroundColor, borderWidth: 2 },
        style,
      ]}
      onPress={onPress}>
      <Text style={[styles.text, { color: textColor }]}>
        {isLoading ? (
          <ActivityIndicator size='large' color={textColor} />
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
