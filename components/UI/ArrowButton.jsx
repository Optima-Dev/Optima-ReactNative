import { Text, StyleSheet, Pressable, Image, Platform } from "react-native";
import Colors from "@/constants/Colors";

function ArrowButton({ text, type, onPress }) {
  const getTypeStyle = () => {
    switch (type) {
      case "MyVision":
        return styles.visionContainer;
      case "MyPeople":
        return styles.peopleContainer;
      default:
        return {};
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        getTypeStyle(),
      ]}
      onPress={onPress}>
      <Text style={[styles.text, styles.secText]}>{text}</Text>
      <Image
        source={require("../../assets/Images/Forward-Arrow.png")}
      />
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
    fontSize: 18,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.6, // Add slight fade effect when pressed
  },
  visionContainer: {
    backgroundColor: "#CCF47D",
    width: Platform.OS === "android" ? 350 : "100%",
    height: Platform.OS === "android" ? 120 : null,
    padding: Platform.OS === "android" ? 15 : 38,
    borderRadius: 20,
    marginTop: 10,
  },
  peopleContainer: {
    backgroundColor: "transparent",
    width: Platform.OS === "android" ? 350 : "100%",
    height: Platform.OS === "android" ? 120 : null,
    padding: Platform.OS === "android" ? 15 : 38,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 4,
    borderColor: Colors.MainColor,
  },
  secText: {
    fontSize: 30,
    fontWeight: "700",
    paddingStart: 10,
  },
  defaultContainer: {
    backgroundColor: "#D0CFFC", // Light purple background
  },
});

export default ArrowButton;
