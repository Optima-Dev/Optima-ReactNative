import { useState } from "react";
import { View, Text, StyleSheet, Image, Platform, Alert } from "react-native";
import { Camera } from "expo-camera";
// import * as Device from 'expo-device';
// import * as Application from 'expo-application';
import { Audio } from "expo-av";
import { Linking } from "react-native";

import Colors from "@/constants/Colors";
import TermsList from "@/components/Terms/TermsList";
import PrimaryButton from "@/components/UI/PrimaryButton";
import MainModal from "../components/UI/MainModal";


async function requestPermissions(setModalVisible) {
  try {
    // Request Camera Permission
    const { status: cameraStatus } =
      await Camera.requestCameraPermissionsAsync();
    if (cameraStatus !== "granted") {
      console.log("Camera permission denied ❌");
      setModalVisible(true);
      return false;
    }
    console.log("Camera permission granted ✅"); // Request Microphone Permission (for voice recognition)
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { status: micStatus } = await Audio.requestPermissionsAsync();
      if (micStatus !== "granted") {
        console.log("Microphone permission denied ❌");
        setModalVisible(true);
        return false;
      }
      console.log("Microphone permission granted ✅");
    } catch (error) {
      console.error("Error setting up audio:", error);
      setModalVisible(true);
      return false;
    }

    // Note: Speech recognition permission (iOS) will be requested by @react-native-voice/voice
    // when Voice.start() is called in the Support component. If you want to request it here,
    // see the optional step below.

    return true;
  } catch (err) {
    console.warn("Error requesting permissions:", err);
    setModalVisible(true);
    return false;
  }
}

function PrivacyTerms({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  async function agreementHandler() {
    const isAllowed = await requestPermissions(setModalVisible);
    if (isAllowed) {
      navigation.navigate("Login");
    } else {
      setModalVisible(true);
    }
  }

  return (

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image
            source={require("../assets/Images/TermsLogo.png")}
            style={styles.image}
          />
          <Text style={styles.MainText}>Privacy And Terms</Text>
          <Text style={styles.SubText}>
            To use Optima, you agree to the following:
          </Text>
        </View>

        {/* Terms List */}
        <View style={styles.TermsContainer}>
          <TermsList />
        </View>

        {/* Confirm Button */}
        <View style={styles.ButtonContainer}>
          <PrimaryButton
            title={"I Agree"}
            onPress={agreementHandler}
            backgroundColor={Colors.MainColor}
            textColor='white'
          />
        </View>

        <MainModal
          onPress={() => setModalVisible(false)} // Close modal without navigating
          isModalOpen={modalVisible}
          logo={require("@/assets/Images/WarningIcon.png")}
          backgroundColor={Colors.yellow700}
          subTitle='Camera and microphone permissions are required to use this app. Please enable them in your device settings.'
          title='Permission Required'
          titleColor={Colors.black}
          buttonText='Open Settings'
          onButtonPress={() => {
            Linking.openSettings();
            setModalVisible(false);
          }}
        />
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  headerContainer: {
    alignItems: "center",
  },
  image: {
    width: 110,
    height: 110,
  },
  MainText: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.MainColor,
    marginTop: Platform.OS === "ios" ? 12 : 5,
  },
  SubText: {
    fontSize: 22,
    color: Colors.black,
    marginTop: 10,
    fontWeight: "300",
    textAlign: "center",
    width: 280,
  },
  ButtonContainer: {
    width: Platform.OS === "android" ? 350 : 388,
    height: 55,
    position: "absolute",
    bottom: Platform.OS === "android" ? 20 : 32,
  },
  TermsContainer: {
    flex: 1,
    marginTop: 20,
  },
});

export default PrivacyTerms;
