import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { Camera } from "expo-camera";

import Colors from "@/constants/Colors";
import TermsList from "@/components/Terms/TermsList";
import PrimaryButton from "@/components/UI/PrimaryButton";
import MainModal from "../components/UI/MainModal";

async function requestPermissions(setModalVisible) {
  try {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      if (
        granted["android.permission.CAMERA"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.RECORD_AUDIO"] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log("Camera & Mic permissions granted ✅");
        return true;
      } else {
        console.log("Camera or Mic permissions denied ❌");
        setModalVisible(true);
        return false;
      }
    } else if (Platform.OS === "ios") {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: microphoneStatus } = await Camera.requestMicrophonePermissionsAsync();

      console.log("Camera status", cameraStatus);
      console.log("Microphone status", microphoneStatus);
      
      if (cameraStatus === "granted" && microphoneStatus === "granted") {
        console.log("Camera & Mic permissions granted ✅");
        return true;
      } else {
        console.log("Camera or Mic permissions denied ❌");
        return false;
      }
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

function PrivacyTerms({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  async function agreementHandler() {
    
    // const isAllowed = await requestPermissions(setModalVisible);
    // if (!isAllowed) {
      // setModalVisible(prev => !prev);
    // }  else {
      // navigation.navigate("Login");
    // }

    requestPermissions(setModalVisible);
    if (!modalVisible) {
      navigation.navigate("Login");
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
        onPress={agreementHandler}
        isModalOpen={modalVisible}
        logo={require("@/assets/Images/WarningIcon.png")}
        backgroundColor={Colors.yellow700}
        subTitle="By cancelling you will have to accept it later if you want to use our app properly."
        title="Warning!"
        titleColor={Colors.black}
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
    marginTop: Platform.OS === "android" ? 5 : 12,
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
  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 320,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  warningIcon: {
    width: 50,
    height: 50,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    marginVertical: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: Colors.MainColor,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  okButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PrivacyTerms;
