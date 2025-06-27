import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import Colors from "../../constants/Colors";

function CallButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>CALL{"\n"}A VOLUNTEER</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.MainColor,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flex: Platform.OS === "ios" ? 1 : null,
    width: Platform.OS === "ios" ? '100%' : 350,
    height: Platform.OS === "ios" ? null : 340,
    marginBottom: 10,
  },
  text: {
    color: "white",
    fontSize: 40,
    fontWeight: 700,
    textAlign: "center",
  },
});

export default CallButton;
