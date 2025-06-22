import { useLayoutEffect, useState, useEffect, useRef } from "react";
import React from "react";
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import PrimaryButton from "../../components/UI/PrimaryButton";
import Colors from "../../constants/Colors";
import { useMeeting } from "../../store/MeetingContext";
import { useAuth } from "../../store/AuthContext";
import { useUser } from "../../store/UserContext";
import { requestTwilioPermissions } from "../../util/TwilioUtils"
import TwilioVideoComponent from "../../components/TwilioVideoComponent";

const CallVolunteer = ({ navigation }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Waiting for someone to join...");
  // This ref will now point to our new TwilioVideoComponent.
  const twilioComponentRef = useRef(null);
  const {
    twilioToken,
    roomName,
    identity,
    startMeeting,
    endMeeting,
    endAllMeetings,
    loading,
    error,
  } = useMeeting();
  const { token } = useAuth();
  const { user } = useUser();

  useLayoutEffect(() => {
    const parentNav = navigation.getParent();
    parentNav?.setOptions({ tabBarStyle: { display: "none" } });

    return () => {
      parentNav?.setOptions({
        tabBarStyle: {
          display: "flex",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          marginBottom: Platform.OS === "ios" ? 0 : 12,
        },
      });
    };
  }, [navigation]);

  useEffect(() => {
    if (!token) {
      console.error("Missing authentication token in CallVolunteer");
    } else {
      console.log("Auth token is available for meeting");
    }

    const setupCall = async () => {
      try {
        console.log("Setting up call - user:", user ? user._id : "undefined");
        let permissions;
        try {
          permissions = await requestTwilioPermissions();
        } catch (permissionsError) {
          console.error("Failed to request permissions:", permissionsError);
          Alert.alert(
            "Permission Error",
            "Failed to request camera and microphone permissions. Please grant permissions manually in your device settings.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );
          return;
        }

        if (!permissions.cameraGranted || !permissions.audioGranted) {
          Alert.alert(
            "Permission Required",
            "Camera and microphone permissions are required for video calls.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );
          return;
        }

        console.log("Starting a volunteer meeting with user ID:", user?._id);
        setIsCalling(true);

        const result = await startMeeting({
          token,
          role: "seeker",
          seekerId: user._id,
          topic: "Volunteer Assistance",
          meetingType: "global",
          helperId: null,
        });

        if (!result.success) {
          setIsCalling(false);
          const errorMessage = result.error || "Please try again";
          console.error("Meeting start failed with error:", errorMessage);

          if (errorMessage.includes("already have an active meeting")) {
            Alert.alert(
              "Active Meeting Exists",
              "You already have an active meeting. Would you like to end it and start a new one?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                  onPress: () => navigation.goBack(),
                },
                {
                  text: "End Current & Start New",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      console.log("Attempting to end all active meetings");
                      const endResult = await endAllMeetings(token);

                      if (endResult.success) {
                        console.log("All active meetings ended successfully");
                        setTimeout(() => {
                          setupCall();
                        }, 1000);
                      } else {
                        throw new Error(
                          endResult.error || "Failed to end meetings"
                        );
                      }
                    } catch (endError) {
                      console.error(
                        "Failed to end existing meetings:",
                        endError
                      );
                      Alert.alert(
                        "Error",
                        "Failed to end existing meetings. Please try again later."
                      );
                      navigation.goBack();
                    }
                  },
                },
              ]
            );
          } else {
            Alert.alert("Error", `Failed to start the call: ${errorMessage}`);
            navigation.goBack();
          }
          return;
        }
      } catch (callError) {
        Alert.alert(
          "Error",
          `Failed to start the call: ${
            callError.message || "Please try again."
          }`
        );
        console.error("Call initialization error:", callError);
        navigation.goBack();
      }
    };

    setupCall();

    return () => {
      // The new component also handles its own disconnection, but ending the meeting here is still correct.
      if (roomName) {
        endMeeting({ token, meetingId: roomName });
      }
    };
  }, []);

  useEffect(() => {
    if (twilioToken && roomName && isCalling) {
      console.log("Monitoring connection state for:", roomName);
      const connectionTimeout = setTimeout(() => {
        if (!isConnected) {
          console.log("Connection timeout after 20 seconds");
          setStatus("Connection timeout. Please try again.");
          Alert.alert(
            "Connection Timeout",
            "Unable to connect to the video call after 20 seconds. Please try again.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );
        }
      }, 20000);

      return () => {
        clearTimeout(connectionTimeout);
        console.log("Cleaning up connection timeout");
      };
    }
  }, [twilioToken, roomName, isCalling, isConnected, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  function handleEndingCall() {
    // The new component handles its own disconnect, so this is fine.
    endMeeting({ token, meetingId: roomName });
    setIsCalling(false);
    navigation.goBack();
  }

  function handleFlipCamera() {
    // This will work perfectly with the new component.
    if (twilioComponentRef.current) {
      twilioComponentRef.current.flipCamera();
    } else {
      console.log("No ref to Twilio component");
    }
  }

  // 2. This function now uses the new, simplified TwilioVideoComponent.
  const renderTwilioVideo = () => {
    if (!isCalling || !twilioToken || !roomName) {
      return null;
    }

    return (
      <TwilioVideoComponent
        ref={twilioComponentRef}
        token={twilioToken}
        roomName={roomName}
        identity={identity}
        style={styles.twilioVideo}
        onRoomDidConnect={() => {
          console.log("Room connected successfully!");
          setIsConnected(true);
          setStatus("Connected!");
        }}
        onRoomDidDisconnect={({ error: disconnectError }) => {
          console.log("Room disconnected", disconnectError);
          setIsConnected(false);
          setStatus("Disconnected");
          if (disconnectError) {
            Alert.alert(
              "Call Ended",
              disconnectError.message || "The call has ended"
            );
          }
        }}
        onRoomDidFailToConnect={(failError) => {
          console.error("Room failed to connect:", failError);
          setStatus("Failed to connect");
          Alert.alert(
            "Connection Failed",
            failError.message || "Failed to connect to the call"
          );
        }}
        onParticipantAddedVideoTrack={() => {
          console.log("Participant added video track");
          setStatus("Volunteer joined the call");
        }}
        onParticipantRemovedVideoTrack={() => {
          console.log("Participant removed video track");
          setStatus("Volunteer left the call");
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {isCalling ? (
          <>
            {renderTwilioVideo()}
            {!isConnected && (
              <View style={styles.statusOverlay}>
                <Text style={styles.statusText}>
                  {loading ? "Starting call..." : status}
                </Text>
              </View>
            )}
          </>
        ) : (
          <>
            <ImageBackground
              source={require("../../assets/Images/volunteer.jpeg")}
              style={styles.personImage}
              blurRadius={12}
            />
            <Text style={styles.waiting}>
              {loading ? "Starting call..." : "Wait for someone to join you .."}
            </Text>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          backgroundColor={Colors.MainColor}
          textColor='white'
          title='Flip Camera'
          style={styles.button}
          onPress={handleFlipCamera}
          disabled={!isConnected}
        />
        <PrimaryButton
          backgroundColor={Colors.red600}
          textColor='white'
          title='End Call'
          style={styles.button}
          onPress={handleEndingCall}
        />
      </View>
    </View>
  );
};

export default CallVolunteer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  personImage: {
    flex: 1,
    width: "100%",
  },
  waiting: {
    fontSize: 40,
    fontWeight: "700",
    color: Colors.white,
    position: "absolute",
    textAlign: "center",
    padding: 20,
  },
  twilioVideo: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  statusOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  statusText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});
