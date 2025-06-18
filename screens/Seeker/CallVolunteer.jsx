import { useLayoutEffect, useState, useRef, useEffect } from "react";
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
import {
  requestTwilioPermissions,
  formatTwilioError,
} from "../../util/TwilioUtils";

const CallVolunteer = ({ navigation }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Waiting for someone to join...");
  const twilioRef = useRef(null);

  const { twilioToken, roomName, startMeeting, endMeeting } = useMeeting();
  const { token, role } = useAuth();
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
    // Request permissions and initialize the call
    const setupCall = async () => {
      try {
        // Request camera and microphone permissions
        const permissions = await requestTwilioPermissions();
        if (!permissions.cameraGranted || !permissions.audioGranted) {
          Alert.alert(
            "Permission Required",
            "Camera and microphone permissions are required for video calls.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );
          return;
        }

        // Initialize the call
        await startMeeting({
          token,
          role: "seeker",
          seekerId: user._id, // Use the user._id from UserContext
          topic: "Volunteer Assistance",
        });
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
      if (isConnected) {
        twilioRef.current?.disconnect();
      }
      endMeeting(token);
    };
  }, []);

  useEffect(() => {
    // Connect to the Twilio room when token is available
    if (twilioToken && roomName && twilioRef.current) {
      twilioRef.current.connect({
        accessToken: twilioToken,
        roomName: roomName,
      });
      setStatus("Connecting to volunteer...");
    }
  }, [twilioToken, roomName]);

  function handleEndingCall() {
    if (isConnected) {
      twilioRef.current?.disconnect();
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
                  Alert.alert("Call Ended", formatTwilioError(error));
                }
              }}
              onRoomDidFailToConnect={(error) => {
                setStatus("Failed to connect");
                Alert.alert("Connection Failed", formatTwilioError(error));
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
                <Text style={styles.statusText}>{status}</Text>
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
            <Text style={styles.waiting}>Wait for someone to join you ..</Text>
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
    backgroundColor: "#1E1E1E80",
    flexDirection: "row",
    padding: 20,
    gap: 10,
  },
  button: {
    width: "49%",
  },
});
