import { useLayoutEffect, useState, useEffect, useRef } from "react";
import React from "react";
import { StyleSheet, Text, View, Alert, Platform } from "react-native";
import { TwilioVideo } from "react-native-twilio-video-webrtc";
import PrimaryButton from "../../components/UI/PrimaryButton";
import Colors from "../../constants/Colors";
import { useMeeting } from "../../store/MeetingContext";
import { useAuth } from "../../store/AuthContext";
import { requestTwilioPermissions } from "../../util/TwilioUtils";
import { useNavigation } from "@react-navigation/native";

const CallScreen = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Connecting to the call...");
  const twilioRef = useRef(null);
  const navigation = useNavigation();

  const { twilioToken, roomName, identity, endMeeting, loading } = useMeeting();
  const { token } = useAuth();

  useLayoutEffect(() => {
    // Hide tab bar for immersive experience
    const parentNav = navigation.getParent();
    parentNav?.setOptions({ tabBarStyle: { display: "none" } });

    return () => {
      // Restore tab bar when leaving
      parentNav?.setOptions({
        tabBarStyle: {
          display: "flex",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          // marginBottom: Platform.OS === "ios" ? 0 : 12,
        },
      });
    };
  }, [navigation]);
  useEffect(() => {
    // Request permissions
    const checkPermissions = async () => {
      try {
        // Import requestTwilioPermissions dynamically if needed
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
        }
      } catch (error) {
        console.error("Permissions error:", error);
        Alert.alert("Error", "Failed to get camera/microphone permissions");
        navigation.goBack();
      }
    };

    checkPermissions(); // Clean up on unmount
    return () => {
      if (isConnected && twilioRef.current) {
        twilioRef.current.disconnect();
      }
      // Only end the meeting if we have a meetingId
      if (roomName) {
        endMeeting(token, roomName);
      }
    };
  }, []);
  useEffect(() => {
    // Connect to the Twilio room when token is available
    if (twilioToken && roomName) {
      console.log("Connecting to Twilio room:", roomName);
      console.log("Using Twilio token:", twilioToken.substring(0, 20) + "...");
      console.log(
        "Identity for connection:",
        identity || "No identity provided"
      );

      // Set a connection timeout in case the connection doesn't establish
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

      // Clean up the timeout when unmounting or when successfully connected
      return () => {
        clearTimeout(connectionTimeout);
        console.log("Cleaning up connection timeout");
      };
    } else {
      if (!twilioToken) console.log("Missing Twilio token");
      if (!roomName) console.log("Missing room name");
    }
  }, [twilioToken, roomName, identity, isConnected, navigation]);
  function handleEndCall() {
    if (isConnected && twilioRef.current) {
      twilioRef.current.disconnect();
    }
    // Ensure we pass the meetingId to the endMeeting function
    endMeeting(token, roomName);
    navigation.goBack();
  }

  function handleFlipCamera() {
    if (twilioRef.current) {
      twilioRef.current.flipCamera();
    }
  }
  // Debug Twilio component rendering
  useEffect(() => {
    console.log("Helper component rendering state:", {
      twilioToken: !!twilioToken,
      roomName: !!roomName,
      twilioRefExists: !!twilioRef.current,
      identity: !!identity,
    });
  }, [twilioToken, roomName, identity]); // Special wrapper around TwilioVideo to avoid ref issues
  const renderTwilioVideo = () => {
    if (!twilioToken || !roomName) {
      console.log("Cannot render Helper TwilioVideo - missing required props");
      return null;
    }

    console.log(
      "Rendering Helper TwilioVideo component with token and roomName"
    );

    // This is a known workaround for TwilioVideo ref issues
    const setRef = (ref) => {
      if (ref) {
        twilioRef.current = ref;
        console.log("Helper TwilioVideo ref successfully set:", !!ref);

        // Try to connect once the ref is available
        if (twilioToken && roomName) {
          try {
            const connectionOptions = {
              accessToken: twilioToken,
              roomName: roomName,
            };
            if (identity) {
              connectionOptions.identity = identity;
            }

            setTimeout(() => {
              if (twilioRef.current) {
                console.log(
                  "Helper connecting with options:",
                  connectionOptions
                );
                twilioRef.current.connect(connectionOptions);
              }
            }, 500);
          } catch (error) {
            console.error("Failed to connect:", error);
          }
        }
      }
    };

    return (
      <TwilioVideo
        ref={setRef}
        onRoomDidConnect={() => {
          console.log("Helper room connected successfully!");
          setIsConnected(true);
          setStatus("Connected!");
        }}
        onRoomDidDisconnect={({ error }) => {
          console.log("Helper room disconnected", error);
          setIsConnected(false);
          setStatus("Disconnected");
          if (error) {
            Alert.alert("Call Ended", error.message || "The call has ended");
          }
          navigation.goBack();
        }}
        onRoomDidFailToConnect={(error) => {
          console.error("Helper room failed to connect:", error);
          setStatus("Failed to connect");
          Alert.alert(
            "Connection Failed",
            error.message || "Failed to connect to the call"
          );
          navigation.goBack();
        }}
        onParticipantAddedVideoTrack={(event) => {
          console.log("Participant added video track:", event);
          setStatus("Seeker joined the call");
        }}
        onParticipantRemovedVideoTrack={() => {
          console.log("Participant removed video track");
          setStatus("Seeker left the call");
        }}
        style={styles.twilioVideo}
      />
    );
  };
  // Connection will be handled in the ref callback instead of a separate useEffect

  return (
    <View style={styles.container}>
      {" "}
      <View style={styles.videoContainer}>
        {renderTwilioVideo()}
        {!isConnected && (
          <View style={styles.statusOverlay}>
            <Text style={styles.statusText}>
              {loading ? "Preparing call..." : status}
            </Text>
          </View>
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
          onPress={handleEndCall}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoContainer: {
    flex: 1,
    position: "relative",
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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
    backgroundColor: "#111",
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});

// Using useRef instead of defaultProps with createRef

export default CallScreen;
