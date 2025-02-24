import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import ProgressBar from "../components/UI/ProgressBar";
import Colors from "../constants/Colors";
import OnBoardingButton from "../components/UI/OnBoardingButton";

function OnBoarding1({ navigation, step, setStep }) {
  return (
    <>
      <View style={styles.ProgressBar}>
        <ProgressBar step={step} />
      </View>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text1}>WELCOME {"\n"}TO A NEW {"\n"}WORLD OF VISION !</Text>
          <Text style={styles.text2}>
            Optima is your number one choice as a helping tool for all your daily tasks as a human being. It’s all designed carefully for all levels of blindness disability.
          </Text>
        </View>
        <Image
          style={styles.image}
          source={require('../assets/Images/OnBoarding1.png')} // Correct image path
        />
        <View style={styles.ButtonsContainer}>
          <OnBoardingButton type={'skip'} onPress={() => navigation.navigate('Start')} />
          <OnBoardingButton type={'next'} onPress={() => {
            setStep(2);
            navigation.navigate('OnBoarding2');
          }} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ProgressBar: {
    marginTop: 50,
  },
  textContainer: {
    position: 'absolute',
    top: 20,
    alignItems: 'center',
  },
  text1: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.white,
    marginEnd: 30,
    textAlign: 'left',
  },
  text2: {
    fontSize: 18,
    color: Colors.white,
    marginHorizontal: 10,
    textAlign: 'left',
    marginTop: 5,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 150,
  },
  ButtonsContainer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});

export default OnBoarding1;