import { useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import MainHeader from "@/components/UI/MainHeader";
import InstructionItem from "@/components/Instructions/InstructionItem";
import Colors from "@/constants/Colors";
import PrimaryButton from "@/components/UI/PrimaryButton";
import { AuthContext } from "@/store/AuthContext";


const INSTRUCTIONS = {
  "seeker": [
    {
      step: 1,
      text: `You can navigate the whole app by using voice commands.\nJust talk out loud with whatever you want to do.`,
      ImgSource: require("../assets/Images/voice-command 1.png"),
    },
    {
      step: 2,
      text: `You can call one of our volunteers on a video call by clicking on the button or by reading out loud ”Call a volunteer”.`,
      ImgSource: require("../assets/Images/video-call 1.png"),
    },
    {
      step: 3,
      ImgSource: require("../assets/Images/camera 1.png"),
      text: `You can use our AI feature that would describe the whole view in front of you. Just say out loud “Open my vision“ then “Take a picture“.`,
    },
    {
      step: 4,
      text: `In my people section you will be able to add your family and friends accounts so you can call them easily by saying out loud “Call person’s name “.`,
      ImgSource: require("../assets/Images/family 1.png"),
    }
  ],
  "helper": [
    {
      step: 1,
      text: `We will send you a notification whenever someone needs help specifically people who speaks your native language.`,
      ImgSource: require("../assets/Images/Vector.png"),
    },
    {
      step: 2,
      text: `Click on the notification to open our app and directly go to the notification tap.`,
      ImgSource: require("../assets/Images/Group.png"),
    },
    {
      step: 3,
      text: `Whenever you are ready to start the video call press on the accept the call button.`,
      ImgSource: require("../assets/Images/icon-park-outline_click-tap.png"),
    },
    {
      step: 4,
      text: `Now you can help the person we assigned you to help.\nDo not forget our warnings.`,
      ImgSource: require("../assets/Images/Vector.png"),
    }
  ]
};

const HEADER = {
  "seeker": {
    title: `HELLO OUR\nFRIEND !`,
    subtitle: `Here is some instructions on how to use our app in the most efficient way.`,
    noimage: true,
  },
  "helper": {
    subtitle: `Here is some instructions on how to pick-up a call :`,
    imageTitle: true,
  }
}


const Instructions = ({ navigation }) => {
  const { role } = useContext(AuthContext);

  function handlePressGotit() {
    if(role === "seeker") {
      navigation.navigate('MyTabs');
    } else {
      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
      <MainHeader {...HEADER[role]} />

      <ScrollView style={styles.instructions} showsVerticalScrollIndicator={false}>
        <View style={styles.instructionsContainer}>
          { INSTRUCTIONS[role].map(instruction => <InstructionItem key={instruction.step} {...instruction} /> )}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          backgroundColor={Colors.MainColor}
          textColor={Colors.white}
          onPress={handlePressGotit}
          title="Got it !"
        />
      </View>
    </View>
  );
};

export default Instructions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  instructions: {
    flex: 1,
    paddingTop: 24,
  },
  instructionsContainer: {
    gap: 34,
    paddingVertical: 10,
  },
  text: {
    color: Colors.black,
    fontSize: 18,
    lineHeight: 26,
    flexShrink: 1, // Prevents text from overflowing
  },
  innerText: {
    color: Colors.MainColor,
  },
  buttonContainer: {
    paddingVertical: 16,
  },
});
