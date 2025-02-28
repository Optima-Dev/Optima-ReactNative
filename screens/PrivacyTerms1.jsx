import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  Modal,
  Pressable,
  Alert,
} from "react-native";

import Colors from "@/constants/Colors";
import TermsList from "@/components/Terms/TermsList";
import PrimaryButton from "@/components/UI/PrimaryButton";
import { PermissionStatus, useCameraPermissions, useMicrophonePermissions } from "expo-camera";


async function requestPermissions(setModalVisible, verifyPermissionsOnIos) {
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
      } else {
        console.log("Camera or Mic permissions denied ❌");
        setModalVisible(true); // Show warning modal if denied
      }
    }
    else if(Platform.OS === 'ios') {
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

function PrivacyTerms1({ navigation , route }) {
  const { role } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [cameraPermission, requestCamera] = useCameraPermissions();
  const [micPermission, requestMic] = useMicrophonePermissions();

  // async function verifyPermissionsOnIos() {
    // try {
    //   // First check current status without requesting
    //   if (cameraPermission.status === PermissionStatus.UNDETERMINED || 
    //       micPermission.status === PermissionStatus.UNDETERMINED) {
        
    //     // Request both permissions simultaneously
    //     const [cameraResponse, micResponse] = await Promise.all([
    //       requestCamera(),
    //       requestMic()
    //     ]);
  
    //     // Check immediate responses
    //     if (!cameraResponse.granted || !micResponse.granted) {
    //       return false;
    //     }
    //   }
  
    //  // Final check after potential updates
    //   const finalCameraStatus = cameraPermission.status === PermissionStatus.GRANTED;
    //   const finalMicStatus = micPermission.status === PermissionStatus.GRANTED;
  
    //   return finalCameraStatus && finalMicStatus;
      
    // } catch (error) {
    //   console.error("Permission error:", error);
    //   return false;
    // }
  // }

  // async function handleAllow() {
  //   if (Platform.OS === 'ios') {
  //     // Explicitly request permissions again to trigger native dialog
  //     const [cameraResponse, micResponse] = await Promise.all([
  //       requestCamera(),
  //       requestMic(),
  //     ]);
      
  //     if (!(cameraResponse.granted && micResponse.granted)) {
  //       setModalVisible(true);
  //     }
  //   }
  //   const granted = await requestPermissions(setModalVisible, verifyPermissionsOnIos);
  //   if (granted) {
  //     navigation.navigate("Login");
  //   } else {
  //     setModalVisible(true);
  //   }
  // }

  function agreementHandler() {
    // Alert.alert(
    //   "Camera, Video and Microphone",
    //   "Allow optima to have control over these while using app",
    //   [
    //     { 
    //       text: "Cancel", 
    //       onPress: () => {
    //         setModalVisible(true); // Show warning modal
    //         // Stay on current page
    //       }
    //     },
    //     { 
    //       text: "Allow", 
    //       onPress: handleAllow
    //     },
    //   ]
    // );

    requestPermissions(setModalVisible);
    if (!modalVisible) {
      navigation.navigate("Login" , { role });
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
          textColor="white"
        />
      </View>

      {/* Warning Modal */}
      <Modal visible={modalVisible} transparent animationType='fade'>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Image
              source={require("../assets/Images/WarningIcon.png")}
              style={styles.warningIcon}
            />
            <Text style={styles.modalTitle}>Warning!</Text>
            <Text style={styles.modalMessage}>
              By canceling, you will have to accept it later if you want to use
              our app properly.
            </Text>
            <Pressable
              style={styles.okButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.okButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.SeconderyColor,
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

export default PrivacyTerms1;
