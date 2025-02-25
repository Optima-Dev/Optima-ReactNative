import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import ProgressBar from "@/components/UI/ProgressBar";
import Button from "@/components/UI/OnBoardingButton";
import Colors from "@/constants/Colors";

function OnBoarding2({ navigation, step, setStep }) {
  return (
    <>
      <View style={styles.ProgressBar}>
        <ProgressBar step={step} />
      </View>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text1}>HELP SPREDING THE VISION !</Text>
          <Text style={styles.text2}>
            You can now join us as a volunteer and one of many who help the
            blindly disabled community go on with their life. It will be a good
            and safe environment to show all the good in you.
          </Text>
        </View>
        <Image
          style={styles.image}
          source={require("@/assets/Images/OnBoarding3.png")}
        />
        <View style={styles.ButtonContainer}>
          <Button
            type={"Start"}
            onPress={() => {
              navigation.navigate("Start");
            }}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ProgressBar: {
    marginTop: 50,
  },
  textContainer: {
    position: "absolute",
    top: 20,
    alignItems: "center",
  },
  text1: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.white,
    marginEnd: 68,
    textAlign: "left",
  },
  text2: {
    fontSize: 17,
    color: Colors.white,
    marginHorizontal: 20,
    textAlign: "left",
    marginTop: 30,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 150,
  },
  ButtonContainer: {
    position: "absolute",
    bottom: 60,
    right: 45,
  },
});

export default OnBoarding2;
