import { View, Text, Image, StyleSheet, Platform } from "react-native";
import Colors from "@/constants/Colors";

function MainHeader({ title, subtitle, login, noImage, imageTitle }) {
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
        <View style={[styles.logoContainer, login && { marginRight: 20 }]}>
          <Text style={styles.imageTitle}>Optima</Text>
        </View>
      )}

      {title && (
        <Text
          style={[
            styles.title,
            imageTitle && { fontSize: 26 },
            login && { marginRight: 30 },
          ]}>
          {title}
        </Text>
      )}
      <Text style={[styles.subtitle, login && { marginRight: 30 }]}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
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
    marginTop: 20,
  },
  subtitle: {
    fontSize: Platform.OS === "android" ? 18 : 20,
    color: Colors.black,
    fontWeight: "300",
    marginVertical: Platform.OS === "android" ? 0 : 12,
  },
});

export default MainHeader;
