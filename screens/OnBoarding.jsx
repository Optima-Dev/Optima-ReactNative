import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import OnBoardingContent from "../components/OnBoarding/OnBoardingContent";
import onBoardingImage1 from "@/assets/Images/OnBoarding1.png";
import onBoardingImage2 from "@/assets/Images/OnBoarding2.png";
import onBoardingImage3 from "@/assets/Images/OnBoarding3.png";
import { SafeAreaView } from "react-native";
import Colors from "../constants/Colors";

function OnBoarding1({ navigation }) {

  const [step, setStep] = useState(1);
  
  // Reset to step 1 whenever this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setStep(1);
    }, [])
  );

  function handleNext() {
    setStep(prevStep => prevStep + 1);
    if(step === 3) {
      navigation.navigate("Start");
      setStep(3);
    }
  }

  let content = (
    <OnBoardingContent
      step={step}
      title={`WELCOME\nTO A NEW\nWORLD OF VISION !`}
      description='Optima is your number one choice as a helping tool for all your daily tasks as a human being. It’s all designed carefully for all levels of blindness disability.'
      imageUri={onBoardingImage1}
      handleNext={handleNext}
    />
  )

  if(step === 2) {
    content = (
      <OnBoardingContent
        step={step}
        title={`WITH A GLIMPSE\nOF VISION..`}
        description={`Our slogan is exactly what we offer to you or to a beloved one.\nWe will guide you wherever, whenever and however with many available options.`}
        imageUri={onBoardingImage2}
        handleNext={handleNext}
      />
    )
  }
  else if (step === 3) {
    content = (
      <OnBoardingContent
        step={step}
        title='HELP SPREDING THE VISION !'
        description='You can now join us as a volunteer and one of many who help the blindly disabled community go on with their life. It will be a good and safe environment to show all the good in you.'
        imageUri={onBoardingImage3}
        handleNext={handleNext}
      />
    )
  }

  return (
    <>
      { content }
    </>
  );
}

export default OnBoarding1;
