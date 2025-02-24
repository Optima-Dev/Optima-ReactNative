import { View, Text, StyleSheet, Image } from "react-native";
import Colors from "../../constants/Colors";

function TermItem({ iconSource, text }) {
  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Image source={iconSource} style={styles.icon} />
      </View>

      {/* Text */}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.grey500, // Light gray background
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 15,
    width: 350,
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "white", // Circle background
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  icon: {
    width: 38,
    height: 38,
    resizeMode: "contain",
  },
  text: {
    fontSize: 15,
    color: "black",
    flexShrink: 1, // Ensure text wraps properly
    fontWeight: 300,
  },
});

export default TermItem;
