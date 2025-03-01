import {
  Pressable,
  Text,
  StyleSheet,
  Dimensions,
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
}) {
  const buttonBackgroundColor =
    backgroundColor === "white" ? Colors.MainColor : backgroundColor;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        { backgroundColor, borderColor: buttonBackgroundColor, borderWidth: 2 },
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

const screenWidth = Dimensions.get("window").width;

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
