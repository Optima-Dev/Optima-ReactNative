import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import ArrowButton from "../UI/ArrowButton";

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
    alignItems: "center",
    justifyContent: "center",
    width: 350,
    height: 340,
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
