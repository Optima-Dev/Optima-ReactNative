import { View, Text, Image, StyleSheet, Platform } from "react-native";
import Colors from "@/constants/Colors";

function MainHeader({ title, subtitle, login, noImage }) {
  return (
    <View style={styles.container}>
      {!noImage && (
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/Images/Main-Logo-blue 1.png")}
            style={[styles.logo, login ? styles.postion : null]}
          />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems: "center",
  },
  postion: {
    marginBottom: Platform.OS === "android" ? 15 : 40,
  },
  logoContainer: {
    alignItems: "center",
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
  },
  subtitle: {
    fontSize: Platform.OS === "android" ? 18 : 20,
    color: Colors.black,
    fontWeight: "300",
    marginVertical: Platform.OS === "android" ? 0 : 12,
  },
});

export default MainHeader;
