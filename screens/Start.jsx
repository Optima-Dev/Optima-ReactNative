import { View, Text, StyleSheet, Image, Platform } from "react-native";
import Colors from "@/constants/Colors";
import Card from "@/components/UI/Card";

function Start() {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>OPTIMA</Text>

        {/* Ellips1 */}
        <Image
          style={styles.backgroundImage}
          source={require("../assets/LargeImages-Backup/Ellipse 1.png")} // Replace with your actual image
        />
        <Image
          style={styles.image}
          source={require("@/assets/Images/Main-Logo-blue 1.png")}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.Maintext}>SELECT THE{"\n"}USER TYPE.</Text>
        <Text style={styles.Subtext}>
          It’s either you want help or you want to help, you are totally
          welcomed here.
        </Text>
      </View>
      <View style={styles.cardsContainer}>
        <Image
          style={styles.backgroundImage}
          source={require("../assets/LargeImages-Backup/Ellipse 2.png")} // Replace with your actual image
        />
        <Card
          text={"I WANT SOMEONE TO HELP ME."}
          subText={"( I have a sight disability )"}
          imageSource={require("@/assets/Images/OnBoarding1.png")}
          role='seeker'
        />
        <Card
          text={"I WANT TO HELP SOMEONE"}
          subText={"( I want to share my sight )"}
          imageSource={require("@/assets/Images/Help.png")}
          role='helper'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: Platform.OS === "android" ? 25 : 30,
    fontWeight: 600,
    color: Colors.MainColor,
  },
  image: {
    width: 115,
    height: 109,
    resizeMode: "contain",
    marginVertical: 15,
  },
  backgroundImage: {
    position: "absolute",
    width: 450, // Adjust size as needed
    height: 450,
    borderRadius: 150, // Make it a circle
    // resizeMode: "cover",
    opacity: 0.2, // Reduced opacity
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 100,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 35,
  },
  Maintext: {
    fontSize: Platform.OS === "android" ? 35 : 38,
    textAlign: "start",
    color: Colors.MainColor,
    fontWeight: 700,
    alignSelf: "flex-start",
  },
  Subtext: {
    fontSize: Platform.OS === "android" ? 18 : 23,
    textAlign: "start",
    color: Colors.black,
    alignSelf: "flex-start",
    fontWeight: 300,
    marginTop: Platform.OS === "android" ? 0 : 15,
    lineHeight: 28,
  },
  cardsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 45,
    gap: 30,
  },
});

export default Start;
