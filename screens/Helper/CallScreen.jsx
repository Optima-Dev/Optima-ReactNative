import { useLayoutEffect, useState, useEffect, useRef } from "react";
import React from "react";
import { StyleSheet, Text, View, Alert, Platform } from "react-native";
import PrimaryButton from "../../components/UI/PrimaryButton";
import Colors from "../../constants/Colors";
import { useMeeting } from "../../store/MeetingContext";
import { useAuth } from "../../store/AuthContext";
import { requestTwilioPermissions } from "../../util/TwilioUtils";
import { useNavigation } from "@react-navigation/native";
import TwilioVideoComponent from "../../components/TwilioVideoComponent";

const CallScreen = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Connecting to the call...");
  // This ref will now point to our new TwilioVideoComponent.
  const twilioComponentRef = useRef(null);
  const navigation = useNavigation();

  const { twilioToken, roomName, identity, endMeeting, loading } = useMeeting();
  const { token } = useAuth();

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
        },
      });
    };
  }, [navigation]);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
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

    checkPermissions();

    return () => {
      if (roomName) {
        endMeeting({ token, meetingId: roomName });
      }
    };
  }, []);

  useEffect(() => {
    if (twilioToken && roomName) {
      console.log("Connecting to Twilio room:", roomName);
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
    } else {
      if (!twilioToken) console.log("Missing Twilio token");
      if (!roomName) console.log("Missing room name");
    }
  }, [twilioToken, roomName, isConnected, navigation]);

  function handleEndCall() {
    endMeeting({ token, meetingId: roomName });
    navigation.goBack();
  }

  function handleFlipCamera() {
    if (twilioComponentRef.current) {
      twilioComponentRef.current.flipCamera();
    } else {
      console.log("No ref to Twilio component");
    }
  }

  // 2. This function now uses the new, simplified TwilioVideoComponent.
  const renderTwilioVideo = () => {
    if (!twilioToken || !roomName) {
      console.log("Cannot render Helper TwilioVideo - missing required props");
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
          console.log("Helper room connected successfully!");
          setIsConnected(true);
          setStatus("Connected!");
        }}
        onRoomDidDisconnect={({ error: disconnectError }) => {
          console.log("Helper room disconnected", disconnectError);
          setIsConnected(false);
          setStatus("Disconnected");
          if (disconnectError) {
            Alert.alert("Call Ended", disconnectError.message || "The call has ended");
          }
          navigation.goBack();
        }}
        onRoomDidFailToConnect={(failError) => {
          console.error("Helper room failed to connect:", failError);
          setStatus("Failed to connect");
          Alert.alert(
            "Connection Failed",
            failError.message || "Failed to connect to the call"
          );
          navigation.goBack();
        }}
        onParticipantAddedVideoTrack={() => {
          console.log("Participant added video track");
          setStatus("Seeker joined the call");
        }}
        onParticipantRemovedVideoTrack={() => {
          console.log("Participant removed video track");
          setStatus("Seeker left the call");
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* 3. The stray " " text that was here has been removed. */}
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
          textColor="white"
          title="Flip Camera"
          style={styles.button}
          onPress={handleFlipCamera}
          disabled={!isConnected}
        />
        <PrimaryButton
          backgroundColor={Colors.red600}
          textColor="white"
          title="End Call"
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

export default CallScreen;