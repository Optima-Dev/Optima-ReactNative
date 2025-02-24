import { Pressable, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../constants/Colors";

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <Pressable 
      onPress={() => navigation.goBack()} 
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {/* <Ionicons name="chevron-back" size={24} color={Colors.MainColor} /> */}
      <Image source={require('../../assets/Images/BackIcon.png')} style={styles.icon} />
      <Text style={styles.text}>Back</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: 15,
  },
  pressed: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    color: Colors.MainColor,
    fontWeight: 500,
  },
  icon: {
    marginEnd: 10,
  },
});

export default BackButton;
