import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import ProgressBar from "../components/UI/ProgressBar";
import Button from "../components/UI/OnBoardingButton";
import Colors from "../constants/Colors";

function OnBoarding2({ navigation, step, setStep }) {
  return (
    <>
    <View style={styles.ProgressBar}>
        <ProgressBar step={step} />
    </View>
    <View style={styles.container}> 
        <View style={styles.textContainer}>
            <Text style={styles.text1}>WITH A GLIMPSE 
            {"\n"}OF VISION ..</Text>
            <Text style={styles.text2}>
            Our slogan is exactly what we offer to you or
            to a beloved one.{'\n'}
            We will guide you wherever, whenever and 
            however with many available options.
            </Text>
        </View>
        <Image
            style={styles.image}
            source={require('../assets/Images/OnBoarding2.png')}
        />
      <View style={styles.ButtonsContainer}>
            <Button type={'skip'} onPress={() => navigation.navigate('Start')} />
            <Button type={'next'} onPress={() => {
                setStep(3);
                navigation.navigate('OnBoarding3');
            }
            } />
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
        marginEnd: 60,
        textAlign: 'left',
    },
    text2: {
        fontSize: 18,
        color: Colors.white,
        marginHorizontal: 10,
        textAlign: 'left',
        marginTop: 30,
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

export default OnBoarding2;