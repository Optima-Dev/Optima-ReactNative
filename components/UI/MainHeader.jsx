import { View, Text, Image, StyleSheet, Platform } from "react-native";
import Colors from "@/constants/Colors";

function MainHeader({
  title,
  subtitle,
  login,
  noImage,
  imageTitle
}) {
  console.log(imageTitle, title, subtitle, login, noImage);
  return (
    <View style={styles.container}>
      {!noImage && (
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/Images/Main-Logo-blue 1.png")}
            style={[styles.logo, login ? styles.position : null]}
          />
        </View>
      )}
      
      {imageTitle && (
        <View style={styles.logoContainer}>
          <Text style={styles.imageTitle}>Optima</Text>
        </View>
      )}

      { title && <Text style={styles.title}>{title}</Text> }
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems: "center",
  },
  position: {
    marginBottom: Platform.OS === "android" ? 15 : 40,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 82,
    height: 78,
    // marginBottom: 15,
  },
  imageTitle: {
    fontSize: Platform.OS === "ios" ? 32 : 28,
    color: Colors.MainColor,
    fontWeight: "400",
    fontFamily: "Balgin-Regular",
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: Colors.MainColor,
    marginTop: 10,
  },
  subtitle: {
    fontSize: Platform.OS === "android" ? 18 : 20,
    color: Colors.black,
    fontWeight: "300",
    marginVertical: Platform.OS === "android" ? 0 : 12,
  },
});

export default MainHeader;