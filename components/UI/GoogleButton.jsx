import {
  Pressable,
  Text,
  Image,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import Colors from "../../constants/Colors";

function GoogleButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <View style={styles.content}>
        <Image
          source={require("../../assets/Images/google-icon.png")}
          style={styles.icon}
        />
        <Text style={styles.text}>Google</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.MainColor,
    width: Platform.OS === "android" ? 360 : 364,
    height: 55,
  },
  pressed: {
    opacity: 0.7, // Press effect
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3051D3",
  },
});

export default GoogleButton;
