import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Colors from "@/constants/Colors";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthContext";

function Card({ text, subText, imageSource, role }) {
  const navigation = useNavigation();
  const { handleRole } = useContext(AuthContext);

  function handleNavigation() {
    navigation.navigate("PrivacyTerms");
    handleRole(role);
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={handleNavigation}>
      {/* Image */}
      <Image source={imageSource} style={styles.image} />

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.subText}>{subText}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.MainColor, // Blue color
    padding: 15,
    borderRadius: 20,
    width: Platform.OS === "android" ? 360 : 388,
    height: Platform.OS === "android" ? 130 : 137,
    alignSelf: "center",
    shadowColor: "#000", // Added shadow for better UI
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  pressed: {
    opacity: 0.6, // Effect when pressed
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 15,
    resizeMode: "contain",
  },
  textContainer: {
    flexShrink: 1,
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 5,
  },
  subText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default Card;
