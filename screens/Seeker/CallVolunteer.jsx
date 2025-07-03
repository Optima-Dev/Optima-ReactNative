import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import PrimaryButton from "../../components/UI/PrimaryButton";
import Colors from "../../constants/Colors";
import { useAuth } from "../../store/AuthContext";
import { endMeeting, createMeeting } from "../../util/MeetingHttp";
import AgoraVideoComponent from "../../components/AgoraVideoComponent";
import ScreenWrapper from "../../components/UI/ScreenWrapper";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

// 1. Import Speech for spoken feedback
import * as Speech from "expo-speech";

const CallVolunteer = ({ navigation, route }) => {
  const { meetingData: initialMeetingData, helperName } = route.params || {};

  const [callData, setCallData] = useState(initialMeetingData);
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

  // This effect handles creating a global call
  useEffect(() => {
    if (!initialMeetingData) {
      const createGlobalCall = async () => {
        setIsLoading(true);
        Speech.speak("Connecting to a volunteer."); // Announce the action
        try {
          const response = await createMeeting(token, { type: "global" });
          if (!response?.data)
            throw new Error("Invalid response from server for global call.");
          setCallData(response.data);
        } catch (err) {
          Speech.speak("Sorry, no volunteers are available right now.");
          navigation.goBack();
        } finally {
          setIsLoading(false);
        }
      };
      createGlobalCall();
    }
  }, [initialMeetingData, token]);

  // This effect handles specific friend calls
  useEffect(() => {
    if (!helperName) return;

    Speech.stop(); // Stop any ongoing speech first

    // Add delay to ensure screen is mounted and stable
    const speakTimeout = setTimeout(() => {
      // Speak the full message
      Speech.speak(`Calling ${helperName}. Please wait.`, {
        language: "en-US",
        rate: 0.85, // Slower and clearer
        pitch: 1.0,
      });

      // Start timeout AFTER speaking begins (approximate 3.5s later)
      callTimeoutRef.current = setTimeout(() => {
        Speech.speak(`${helperName} did not answer in time.`);
        handleEndCall();
      }, 3500 + 30000); // Approximate speech duration + 30s wait
    }, 2500); // 2 second buffer for component load

    return () => {
      clearTimeout(speakTimeout);
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
      }
      Speech.stop();
    };
  }, [helperName]);

  // Stop any active speech when navigating away
  useFocusEffect(
    useCallback(() => {
      return () => Speech.stop();
    }, [])
  );

  const handleRemoteUserJoined = () => {
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
    }
    Speech.speak(`${helperName || "The helper"} has joined the call.`);
  };

  const handleEndCall = useCallback(async () => {
    if (isEnding) return;
    Speech.speak("Ending call."); // Announce the action
    setIsEnding(true);
    try {
      await agoraRef.current?.disconnect();
      const channel = callData?.roomName || callData?.channelName;
      if (channel) await endMeeting(token, channel);
    } catch (err) {
      console.error("❌ End call error:", err);
    } finally {
      setTimeout(() => {
        if (navigation.canGoBack()) navigation.goBack();
        else navigation.navigate("Support");
      }, 500);
    }
  }, [isEnding, callData, token, navigation]);

  const handleFlipCamera = useCallback(() => {
    Speech.speak("Flipping camera."); // Announce the action
    agoraRef.current?.flipCamera();
  }, []);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (!isEnding) {
        runOnJS(handleFlipCamera)();
      }
    });

  const swipeDownGesture = Gesture.Pan().onEnd((event) => {
    const { translationY, velocityY } = event;
    if (translationY > 50 && velocityY > 800 && !isEnding) {
      runOnJS(handleEndCall)();
    }
  });

  const combinedGesture = Gesture.Simultaneous(
    doubleTapGesture,
    swipeDownGesture
  );

  const channel = callData?.roomName || callData?.channelName;
  if (
    isLoading ||
    !callData?.token ||
    !channel ||
    !callData?.appId ||
    !callData?.uid
  ) {
    return (
      <ScreenWrapper>
        <View style={styles.fallbackContainer}>
          <ActivityIndicator size='large' color={Colors.white} />
          <Text style={styles.waitingText}>
            {isLoading ? "Connecting..." : "Call information is incomplete."}
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <GestureDetector gesture={combinedGesture}>
        <View style={styles.container}>
          <AgoraVideoComponent
            ref={agoraRef}
            token={callData.token}
            channelName={channel}
            appId={callData.appId}
            uid={Number(callData.uid)}
            onEndCall={handleEndCall}
            shouldConnect={!isEnding}
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
      </GestureDetector>
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
