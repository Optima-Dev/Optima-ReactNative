import { useState, useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

import HelpIcon from "./HelpIcon";
import PrimaryButton from "../../UI/PrimaryButton";
import Colors from "../../../constants/Colors";
import { useAuth } from "../../../store/AuthContext";
// Import the new and existing API functions
import {
  getPendingGlobalMeetings,
  acceptFirstMeeting,
} from "../../../util/MeetingHttp";

// 1. Import your custom MainModal component
import MainModal from "../../UI/MainModal";

function HelpRequests() {
  const [isAskingForHelp, setIsAskingForHelp] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  
  const [modalInfo, setModalInfo] = useState({
    visible: false,
    title: "",
    subTitle: "",
  });

  const navigation = useNavigation();
  const { token } = useAuth();

  // This useEffect now polls the backend for pending global meetings
  useEffect(() => {
    if (!token) return;

    const fetchPendingCalls = async () => {
      try {
        const response = await getPendingGlobalMeetings(token);
        if (response && response.data && response.data.meetings.length > 0) {
          setIsAskingForHelp(true);
        } else {
          setIsAskingForHelp(false);
        }
      } catch (error) {
        console.error("Error fetching pending global calls:", error);
        setIsAskingForHelp(false);
      }
    };

    fetchPendingCalls();
    const intervalId = setInterval(fetchPendingCalls, 5000);
    return () => clearInterval(intervalId);
  }, [token]);

  async function handleAcceptCall() {
    setIsAccepting(true);
    try {
      const response = await acceptFirstMeeting(token);

      // Case 1: Success - we got call data and can navigate
      if (response && response.data) {
        navigation.navigate("CallScreen", {
          videoInfo: response.data,
        });
        // We are navigating away, so we don't need to change state here.
        // We return early to skip the finally block's state changes.
        setIsAccepting(false);
        return;
      }
      
      // Case 2: The API call was successful, but returned no data.
      // This means no calls were available. This is not a "technical" error.
      setModalInfo({
          visible: true,
          title: "Sorry :(",
          subTitle: "It seems another volunteer accepted the call first. Thanks for trying!"
      });

    } catch (error) {
      // Case 3: The API call itself failed (e.g., network error, server error).
      // We log it for debugging but show a user-friendly message.
      console.log("An error occurred while trying to accept a call:", error);
      setModalInfo({
        visible: true,
        title: "An Error Occurred",
        subTitle: "Could not accept the call at this time. There's no pending call right now."
      });
    } finally {
      // This will run after the try or catch block completes.
      // It ensures the UI is reset correctly in all scenarios.
      setIsAskingForHelp(false);
      setIsAccepting(false);
    }
  }

  // Function to close the modal
  const closeModal = () => {
    setModalInfo({ visible: false, title: "", subTitle: "" });
  };

  // Determine button title and modal title based on state
  const buttonTitle = isAskingForHelp
    ? isAccepting
      ? "Accepting..."
      : "Accept The Call"
    : "No One Is Calling";

  const modalTitle = modalInfo.title || (!isAskingForHelp && !isAccepting ? "No One Is Calling" : "");

  return (
    <View style={styles.container}>
      <MainModal
        isModalOpen={modalInfo.visible}
        onPress={closeModal}
        logo={require("../../../assets/Images/Sorry-modal.png")}
        backgroundColor={Colors.MainColor}
        title={modalTitle}
        titleColor={Colors.MainColor}
        subTitle={modalInfo.subTitle}
        buttonText="OK"
      />

      <View style={styles.askForHelpIcon}>
        <HelpIcon isAskingForHelp={isAskingForHelp} />
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={buttonTitle}
          backgroundColor={isAskingForHelp ? Colors.MainColor : Colors.grey400}
          textColor={"white"}
          disabled={!isAskingForHelp || isAccepting}
          onPress={handleAcceptCall}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: Platform.OS === "ios" ? 68 : null,
  },
  askForHelpIcon: {
    flex: Platform.OS === "ios" ? 1 : null,
  },
  buttonContainer: {
    marginTop: Platform.OS === "ios" ? null : 80,
    zIndex: 2,
  },
});

export default HelpRequests;
