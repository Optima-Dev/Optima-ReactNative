import { View, Text, StyleSheet, Image, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

import ProgressBar from "@/components/UI/ProgressBar";
import Colors from "@/constants/Colors";
import OnBoardingButton from "@/components/UI/OnBoardingButton";


function OnBoardingContent({ step, title, description, imageUri, handleNext }) {

  const navigation = useNavigation();

  let buttons = (
    <>
      <OnBoardingButton
        type={"skip"}
        onPress={() => navigation.navigate("Start")}
      />
      <OnBoardingButton
        type={"next"}
        onPress={handleNext}
      />
    </>
  )

  if(step === 3) {
    buttons = (
      <OnBoardingButton
        type={"Start"}
        onPress={handleNext}
      />
    )
  }


  return (
    <>
      <View style={styles.ProgressBar}>
        <ProgressBar step={step} />
      </View>

      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text1}>{ title }</Text>
          <Text style={styles.text2}>{ description }</Text>
        </View>
        
        <View style={styles.secondContainer}>
          <Image style={styles.image} source={imageUri} />
          <View style={[styles.ButtonsContainer, step === 3 ? styles.thirdBoarding : '']}>
            { buttons }
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  ProgressBar: {
    marginTop: 60,
  },
  textContainer: {
    flex: 1,
  },
  text1: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.white,
    marginTop: 10,
  },
  text2: {
    fontSize: 20,
    color: Colors.white,
    marginTop: 20,
    lineHeight: 26,
  },
  secondContainer: {
    flex: 1,
    paddingBottom: 20,
    rowGap: 60,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
  },
  ButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: Platform.OS === 'ios' ? '90%' : '80%',
  },
  thirdBoarding: {
    marginLeft: "auto",
    marginBottom: Platform.OS === 'ios' ? 14 : 0,
  }
});

export default OnBoardingContent;