import { Pressable, Text, StyleSheet, Image, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/constants/Colors";

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.goBack()}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      {/* <Ionicons name="chevron-back" size={24} color={Colors.MainColor} /> */}
      <Image
        source={require("../../assets/Images/BackIcon.png")}
        style={styles.icon}
      />
      <Text style={styles.text}>Back</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Platform.OS === "android" ? 10 : 0,
    marginTop: Platform.OS === "android" ? 15 : 0,
  },
  pressed: {
    opacity: 0.5,
  },
  text: {
    fontSize: Platform.OS === "android" ? 16 : 18,
    color: Colors.MainColor,
    fontWeight: 600,
  },
  icon: {
    marginEnd: 10,
  },
});

export default BackButton;
