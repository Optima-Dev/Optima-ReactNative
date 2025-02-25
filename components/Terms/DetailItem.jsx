import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "@/constants/Colors";

function DetailItem({ text, iconSource }) {
  const navigation = useNavigation();

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <Text style={styles.text}>{text}</Text>
      <Image source={iconSource} style={styles.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#D0CFFC", // Light purple background
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
});

export default DetailItem;
