import { useState, useEffect } from "react";
import { View, StyleSheet, Platform, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import HelpIcon from "./HelpIcon";
import PrimaryButton from "../../UI/PrimaryButton";
import Colors from "../../../constants/Colors";
import { useMeeting } from "../../../store/MeetingContext";
import { useAuth } from "../../../store/AuthContext";

function HelpRequests() {
  const [isAskingForHelp, setIsAskingForHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const {
    fetchPendingMeetings,
    pendingMeetings,
    acceptFirstAvailableMeeting,
    loading: meetingLoading,
  } = useMeeting();
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch pending meetings when component mounts
    const loadPendingMeetings = async () => {
      await fetchPendingMeetings(token);
    };

    loadPendingMeetings();

    // Set up a timer to periodically check for new meetings
    const intervalId = setInterval(loadPendingMeetings, 10000);

    return () => clearInterval(intervalId);
  }, [token]);

  // Update isAskingForHelp based on pending meetings
  useEffect(() => {
    setIsAskingForHelp(pendingMeetings.length > 0);
  }, [pendingMeetings]);

  const handleAcceptCall = async () => {
    if (!isAskingForHelp) return;

    setIsLoading(true);
    try {
      const result = await acceptFirstAvailableMeeting(token);

      if (result.success) {
        // Navigate to a call screen
        navigation.navigate("CallScreen");
      } else {
        Alert.alert("Error", result.error || "Failed to accept call");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.askForHelpIcon}>
        <HelpIcon isAskingForHelp={isAskingForHelp} />
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={isLoading ? "Connecting..." : "Accept The Call"}
          backgroundColor={isAskingForHelp ? Colors.MainColor : Colors.grey400}
          textColor={"white"}
          disabled={!isAskingForHelp || isLoading || meetingLoading}
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
