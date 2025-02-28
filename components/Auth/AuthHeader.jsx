import { View, Text, Image, StyleSheet, Platform } from "react-native";
import Colors from "@/constants/Colors";

function AuthHeader({ title, subtitle, TitleStyle, SubtitleStyle, login }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/Images/Main-Logo-blue 1.png")}
        style={[styles.logo, login ? styles.postion : null]}
      />
      <Text style={[styles.title, TitleStyle]}>{title}</Text>
      <Text style={[styles.subtitle , SubtitleStyle]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  postion: {
    marginBottom: Platform.OS === "android" ? 0 : 40,
  },
  logo: {
    width: Platform.OS === "android" ? 82 : 110,
    height: Platform.OS === "android" ? 78 : 104,
    marginBottom: 15,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: Colors.MainColor,
    textAlign: "left",
    width: 268,
    marginEnd: 60,
  },
  subtitle: {
    fontSize: Platform.OS === "android" ? 18 : 20,
    color: Colors.black,
    textAlign: "left",
    fontWeight: 300,
    marginEnd: 35,
    marginVertical: Platform.OS === "android" ? 0 : 12,
  },
});

export default AuthHeader;