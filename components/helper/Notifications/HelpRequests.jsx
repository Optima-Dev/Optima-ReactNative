import { useState, useEffect } from "react";
import { View, StyleSheet, Platform, Alert } from "react-native";
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

function HelpRequests() {
  const [isAskingForHelp, setIsAskingForHelp] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const navigation = useNavigation();
  const { token } = useAuth();

  // This useEffect now polls the backend for pending global meetings
  useEffect(() => {
    // Don't start polling if the user isn't authenticated
    if (!token) return;

    const fetchPendingCalls = async () => {
      try {
        const response = await getPendingGlobalMeetings(token);
        // Check if the meetings array exists and has items
        if (response && response.data && response.data.meetings.length > 0) {
          setIsAskingForHelp(true);
        } else {
          setIsAskingForHelp(false);
        }
      } catch (error) {
        // In case of an error, assume no help is available
        console.error("Error fetching pending global calls:", error);
        setIsAskingForHelp(false);
      }
    };

    // Fetch once immediately when the component mounts
    fetchPendingCalls();

    // Set up an interval to poll every 5 seconds
    const intervalId = setInterval(fetchPendingCalls, 5000);

    // Clean up the interval when the component unmounts to prevent memory leaks
    return () => clearInterval(intervalId);
  }, [token]); // This effect depends on the user's auth token

  async function handleAcceptCall() {
    setIsAccepting(true);
    try {
      // Call the API to accept the first available meeting
      const response = await acceptFirstMeeting(token);

      // On success, navigate to the CallScreen with the meeting data
      if (response && response.data) {
        navigation.navigate("CallScreen", {
          videoInfo: response.data,
        });
      } else {
        Alert.alert(
          "No Calls Available",
          "There are currently no pending help requests."
        );
        // The call might be gone, so update the state
        setIsAskingForHelp(false);
      }
    } catch (error) {
      console.error("❌ Accept meeting error:", error);
      Alert.alert(
        "Error Accepting Call",
        "The call may have already been accepted by another volunteer."
      );
      // The call might be gone, so update the state
      setIsAskingForHelp(false);
    } finally {
      setIsAccepting(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.askForHelpIcon}>
        <HelpIcon isAskingForHelp={isAskingForHelp} />
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={isAccepting ? "Accepting..." : "Accept The Call"}
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
