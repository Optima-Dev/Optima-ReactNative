import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import PrimaryButton from "../../components/UI/PrimaryButton";
import Colors from "../../constants/Colors";
import { useAuth } from "../../store/AuthContext";
import { endMeeting, createMeeting } from "../../util/MeetingHttp"; // Keep createMeeting for global calls
import AgoraVideoComponent from "../../components/AgoraVideoComponent";
import ScreenWrapper from "../../components/UI/ScreenWrapper";

const CallVolunteer = ({ navigation, route }) => {
  // Get initial data. If it exists, it's a specific friend call.
  const { meetingData: initialMeetingData, helperName } = route.params || {};

  // A single state to hold the call data, whether it's from a specific or global call.
  const [callData, setCallData] = useState(initialMeetingData);

  // isLoading is true only if we need to fetch data for a global call.
  const [isLoading, setIsLoading] = useState(!initialMeetingData);

  const [isEnding, setIsEnding] = useState(false);
  const { token } = useAuth();
  const agoraRef = useRef(null);
  const callTimeoutRef = useRef(null);

  useLayoutEffect(() => {
    const parentNav = navigation.getParent();
    parentNav?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parentNav?.setOptions({ tabBarStyle: { display: "flex" } });
  }, [navigation]);

  // This effect now correctly handles BOTH global and specific calls.
  useEffect(() => {
    // If we did NOT receive meeting data, it must be a global call.
    if (!initialMeetingData) {
      const createGlobalCall = async () => {
        console.log("📞 No initial data found. Creating a new global call...");
        setIsLoading(true);
        try {
          const response = await createMeeting(token, { type: "global" });
          if (!response?.data)
            throw new Error("Invalid response from server for global call.");
          setCallData(response.data);
        } catch (err) {
          console.error("❌ Failed to create global call:", err);
          alert(
            "Could not find an available volunteer at the moment. Please try again later."
          );
          navigation.goBack();
        } finally {
          setIsLoading(false);
        }
      };
      createGlobalCall();
    }
  }, [initialMeetingData, token]); // Runs only if initialMeetingData changes (i.e., on first load)

  // This timeout effect ONLY runs for specific friend calls.
  useEffect(() => {
    // If it's a specific call (we have a helperName), set a timeout.
    if (helperName) {
      callTimeoutRef.current = setTimeout(() => {
        alert(`${helperName} did not answer in time.`);
        handleEndCall();
      }, 30000); // 30 seconds
    }
    return () => {
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
      }
    };
  }, [helperName]);

  const handleRemoteUserJoined = () => {
    console.log("✅ Other user has joined. Clearing timeout.");
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
    }
  };

  const handleEndCall = async () => {
    if (isEnding) return;
    setIsEnding(true);
    try {
      await agoraRef.current?.disconnect();
      const channel = callData?.roomName || callData?.channelName;
      if (channel) {
        await endMeeting(token, channel);
      }
    } catch (err) {
      console.error("❌ End call error:", err);
    } finally {
      setTimeout(() => {
        if (navigation.canGoBack()) navigation.goBack();
        else navigation.navigate("Support");
      }, 500);
    }
  };

  const handleFlipCamera = () => {
    agoraRef.current?.flipCamera();
  };

  // The check now uses the unified `callData` state.
  const channel = callData?.roomName || callData?.channelName;
  if (
    isLoading ||
    !callData?.token ||
    !channel ||
    !callData?.appId ||
    !callData?.uid
  ) {
    return (
      <View style={styles.fallbackContainer}>
        <ActivityIndicator size='large' color={Colors.white} />
        <Text style={styles.waitingText}>
          {isLoading
            ? "Connecting to a volunteer..."
            : "Call information is incomplete."}
        </Text>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AgoraVideoComponent
          ref={agoraRef}
          token={callData.token}
          channelName={channel}
          appId={callData.appId}
          uid={Number(callData.uid)}
          onEndCall={handleEndCall}
          shouldConnect={!isEnding}
          // This remains false to show the PiP view for the Seeker
          alwaysShowLocalFullScreen={false}
          remoteUserName={helperName || "Helper"}
          onRemoteUserJoined={handleRemoteUserJoined}
        />
        <View style={styles.buttonContainer}>
          <PrimaryButton
            backgroundColor={Colors.MainColor}
            textColor='white'
            title='Flip Camera'
            style={styles.button}
            onPress={handleFlipCamera}
            disabled={isEnding}
          />
          <PrimaryButton
            backgroundColor={Colors.red600}
            textColor='white'
            title={isEnding ? "Ending..." : "End Call"}
            style={styles.button}
            onPress={handleEndCall}
            disabled={isEnding}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1C1C1E",
  },
  waitingText: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default CallVolunteer;
