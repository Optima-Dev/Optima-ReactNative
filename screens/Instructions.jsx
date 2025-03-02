import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import MainHeader from "@/components/UI/MainHeader";
import InstructionItem from "../components/Instructions/InstructionItem";
import Colors from "../constants/Colors";
import PrimaryButton from "../components/UI/PrimaryButton";


const Instructions = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.TitleContainer}>
        <Text style={styles.title}>Optima</Text>
      </View>

      <MainHeader
        title={`HELLO OUR\nFRIEND !`}
        subtitle='Here is some instructions on how to use our app in the most efficient way.'
        noImage
      />

      <ScrollView style={styles.instructions}>
        <View style={styles.instructionsContainer}>
          <InstructionItem
            step={1}
            text={`You can navigate the whole app by using voice commands.\nJust talk out loud with whatever you want to do.`}
            ImgSource={require("../assets/Images/voice-command 1.png")}
          />
          <InstructionItem
            step={2}
            text={`You can call one of our volunteers on a video call by clicking on the button or by reading out loud ”Call a volunteer”.`}
            ImgSource={require("../assets/Images/video-call 1.png")}
          />
          <InstructionItem
            step={3}
            ImgSource={require("../assets/Images/camera 1.png")}
            text={`You can use our AI feature that would describe the whole view in front of you. Just say out loud “Open my vision“ then “Take a picture“.`
            }
          />
        </View>
      </ScrollView>


      <View style={styles.buttonContainer}>
        <PrimaryButton
          backgroundColor={Colors.MainColor}
          textColor={Colors.white}
          onPress={() => navigation.navigate("MainTabs")}
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
    padding: 20,
    paddingVertical: 60,
    gap: 20,
  },
  TitleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: Platform.OS === "ios" ? 32 : 28,
    color: Colors.MainColor,
    fontWeight: "400",
    fontFamily: "Balgin-Regular",
  },
  instructions: {
    flex: 1,
    paddingTop: 24,
  },
  instructionsContainer: {
    gap: 30,
  },
  buttonContainer: {
    bottom: -20,
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
});