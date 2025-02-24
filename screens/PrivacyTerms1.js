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
} from "react-native";
import Colors from "../constants/Colors";
import TermsList from "../components/Terms/TermsList";
import ConfirmButton from "../components/UI/ConfirmButton";
import { useNavigation } from "@react-navigation/native";

async function requestPermissions(setModalVisible) {
  try {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      if (
        granted["android.permission.CAMERA"] === PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.RECORD_AUDIO"] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log("Camera & Mic permissions granted ✅");
      } else {
        console.log("Camera or Mic permissions denied ❌");
        setModalVisible(true); // Show warning modal if denied
      }
    }
  } catch (err) {
    console.warn(err);
  }
}

function PrivacyTerms1() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  function agreementHandler() {
    requestPermissions(setModalVisible);
    if(!modalVisible) {
      navigation.navigate("Login");
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image source={require("../assets/Images/TermsLogo.png")} style={styles.image} />
        <Text style={styles.MainText}>Privacy And Terms</Text>
        <Text style={styles.SubText}>To use Optima, you agree to the following:</Text>
      </View>

      {/* Terms List */}
      <View style={styles.TermsContainer}>
        <TermsList />
      </View>

      {/* Confirm Button */}
      <View style={styles.ButtonContainer}>
        <ConfirmButton title={"I Agree"} onPress={agreementHandler} />
      </View>

      {/* Warning Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Image source={require("../assets/Images/WarningIcon.png")} style={styles.warningIcon} />
            <Text style={styles.modalTitle}>Warning!</Text>
            <Text style={styles.modalMessage}>
              By canceling, you will have to accept it later if you want to use our app properly.
            </Text>
            <Pressable style={styles.okButton} onPress={() => setModalVisible(false)}>
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
    marginTop: 5,
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
    width: 350,
    height: 55,
    position: "absolute",
    bottom: 20,
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