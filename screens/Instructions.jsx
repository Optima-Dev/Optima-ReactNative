import { StyleSheet, Text, View } from "react-native";
import MainHeader from "@/components/UI/MainHeader";
import InstructionItem from "../components/Instructions/InstructionItem";
import Colors from "../constants/Colors";

const Instructions = () => {
  return (
    <View style={styles.container}>
      <View style={styles.TitleContainer}>
        <Text style={styles.title}>Optima</Text>
      </View>
      <MainHeader
        title='HELLO OUR FRIEND !'
        subtitle='Here is some instructions on how to use our app in the most efficient way.'
        noImage
      />
      <View style={styles.InstructionsContainer}>
        <InstructionItem
          step={1}
          text='Select the user type.'
          ImgSource={require("../assets/Images/voice-command.pdf")}
        />
        <InstructionItem
          step={2}
          text='Select the user type.'
          ImgSource={require("../assets/Images/video-call.pdf")}
        />
        <InstructionItem
          step={3}
          text='Select the user type.'
          ImgSource={require("../assets/Images/camera.pdf")}
        />
      </View>
    </View>
  );
};

export default Instructions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  TitleContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    color: Colors.MainColor,
    fontWeight: "400",
    fontFamily: "Balgin-Regular",
  },
});
