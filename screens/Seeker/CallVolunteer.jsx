import { useLayoutEffect, useState, useEffect, useRef } from "react";
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { TwilioVideo } from "react-native-twilio-video-webrtc";
import PrimaryButton from "../../components/UI/PrimaryButton";
import Colors from "../../constants/Colors";
import { useMeeting } from "../../store/MeetingContext";
import { useAuth } from "../../store/AuthContext";
import { useUser } from "../../store/UserContext";
import { requestTwilioPermissions } from "../../util/TwilioUtils";

const CallVolunteer = ({ navigation }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Waiting for someone to join...");
  const twilioRef = useRef(null);
  const {
    twilioToken,
    roomName,
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
    // Check if we have a valid token at component mount
    if (!token) {
      console.error("Missing authentication token in CallVolunteer");
    } else {
      console.log("Auth token is available for meeting");
    }

    // Request permissions and initialize the call
    const setupCall = async () => {
      try {
        console.log("Setting up call - user:", user ? user._id : "undefined");
        // Import requestTwilioPermissions dynamically if needed
        let permissions;
        try {
          // Request camera and microphone permissions
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
        } // Initialize the call        console.log("Starting a volunteer meeting with user ID:", user?._id);

        const result = await startMeeting({
          token,
          role: "seeker",
          seekerId: user._id,
          topic: "Volunteer Assistance",
          meetingType: "global", // Use "global" as per API requirements
          helperId: null, // Set to null for global volunteer calls
        });
        if (!result.success) {
          const errorMessage = result.error || "Please try again";
          console.error("Meeting start failed with error:", errorMessage);

          // Handle the case where the user already has an active meeting
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
                      // End all active meetings for this user
                      console.log("Attempting to end all active meetings");
                      const result = await endAllMeetings(token);

                      if (result.success) {
                        console.log("All active meetings ended successfully");
                        // Then try to start a new meeting
                        setTimeout(async () => {
                          setupCall();
                        }, 1000); // Give the server a moment to process the meeting end
                      } else {
                        throw new Error(
                          result.error || "Failed to end meetings"
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
            // Handle other errors
            Alert.alert("Error", `Failed to start the call: ${errorMessage}`);
            navigation.goBack();
          }
          return;
        }

        setIsCalling(true);
      } catch (error) {
        Alert.alert(
          "Error",
          `Failed to start the call: ${error.message || "Please try again."}`
        );
        console.error("Call initialization error:", error);
        navigation.goBack();
      }
    };

    setupCall();

    // Clean up on unmount
    return () => {
      if (isConnected && twilioRef.current) {
        twilioRef.current.disconnect();
      }
      endMeeting(token);
    };
  }, []);
  useEffect(() => {
    // Connect to the Twilio room when token is available
    if (twilioToken && roomName && twilioRef.current) {
      console.log("Connecting to Twilio room:", roomName);
      console.log("Using Twilio token:", twilioToken.substring(0, 20) + "...");

      try {
        twilioRef.current.connect({
          accessToken: twilioToken,
          roomName: roomName,
        });
        setStatus("Connecting to volunteer...");
      } catch (error) {
        console.error("Error connecting to Twilio room:", error);
        setStatus("Connection error");
        Alert.alert(
          "Connection Error",
          "Failed to connect to the video call. Please try again."
        );
      }
    } else {
      if (!twilioToken) console.log("Missing Twilio token");
      if (!roomName) console.log("Missing room name");
      if (!twilioRef.current) console.log("Missing Twilio reference");
    }
  }, [twilioToken, roomName]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  function handleEndingCall() {
    if (isConnected && twilioRef.current) {
      twilioRef.current.disconnect();
    }
    endMeeting(token);
    setIsCalling(false);
    navigation.goBack();
  }

  function handleFlipCamera() {
    if (twilioRef.current) {
      twilioRef.current.flipCamera();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {isCalling ? (
          <>
            <TwilioVideo
              ref={twilioRef}
              onRoomDidConnect={() => {
                setIsConnected(true);
                setStatus("Connected!");
              }}
              onRoomDidDisconnect={({ error }) => {
                setIsConnected(false);
                setStatus("Disconnected");
                if (error) {
                  Alert.alert(
                    "Call Ended",
                    error.message || "The call has ended"
                  );
                }
              }}
              onRoomDidFailToConnect={(error) => {
                setStatus("Failed to connect");
                Alert.alert(
                  "Connection Failed",
                  error.message || "Failed to connect to the call"
                );
                console.error("Connection failed:", error);
              }}
              onParticipantAddedVideoTrack={() => {
                setStatus("Volunteer joined the call");
              }}
              onParticipantRemovedVideoTrack={() => {
                setStatus("Volunteer left the call");
              }}
              onNetworkQualityLevelsChanged={({
                participant,
                localQualityLevel,
              }) => {
                if (localQualityLevel <= 1) {
                  // Poor network quality
                  setStatus("Poor connection quality");
                }
              }}
              style={styles.twilioVideo}
            />
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
