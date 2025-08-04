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
import * as Speech from "expo-speech";

const CallVolunteer = ({ navigation, route }) => {
  const { meetingData: initialMeetingData, helperName } = route.params || {};

  const [callData, setCallData] = useState(initialMeetingData);
  const [isLoading, setIsLoading] = useState(!initialMeetingData);
  const [isEnding, setIsEnding] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const { token } = useAuth();
  const agoraRef = useRef(null);
  const callTimeoutRef = useRef(null);
  const isScreenActive = useRef(true);
  const speechInProgress = useRef(false);
  const pendingSpeech = useRef(null);
  const retryCount = useRef(0);
  const gestureRef = useRef(null);

  // Clear speech queue with timeout
  const clearSpeechQueue = useCallback(async () => {
    if (await Speech.isSpeakingAsync()) {
      console.log("[CallVolunteer] Speech active, stopping existing", {
        platform: Platform.OS,
      });
      await Speech.stop();
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("[CallVolunteer] Speech queue cleared", {
        platform: Platform.OS,
      });
    }
  }, []);

  // Hide tab bar when on this screen
  useLayoutEffect(() => {
    const parentNav = navigation.getParent();
    parentNav?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parentNav?.setOptions({ tabBarStyle: { display: "flex" } });
  }, [navigation]);

  // Create global call if no initial meeting data
  const speakConnectingMessage = useCallback(async () => {
    if (
      speechInProgress.current ||
      !isScreenActive.current ||
      retryCount.current >= 2 ||
      isEnding
    ) {
      console.log("[CallVolunteer] Skipped connecting message:", {
        speechInProgress: speechInProgress.current,
        isScreenActive: isScreenActive.current,
        retryCount: retryCount.current,
        isEnding,
        platform: Platform.OS,
      });
      return;
    }

    await clearSpeechQueue();
    speechInProgress.current = true;
    pendingSpeech.current = "connecting";
    console.log("[CallVolunteer] Connecting message initiated", {
      platform: Platform.OS,
    });
    const message =
      "Connecting to a volunteer. Double-tap to flip the camera. Swipe down with two fingers to end the call. The front camera is active.";
    // Add a small delay before speaking to ensure the user hears the message
    setTimeout(() => {
      Speech.speak(message, {
        language: "en-US",
        rate: 0.85,
        pitch: 1.0,
        onDone: () => {
          console.log("[CallVolunteer] Connecting message done", {
            platform: Platform.OS,
          });
          speechInProgress.current = false;
          pendingSpeech.current = null;
          retryCount.current = 0;
        },
        onError: (err) => {
          console.log("[CallVolunteer] Connecting message error:", err, {
            platform: Platform.OS,
          });
          speechInProgress.current = false;
          pendingSpeech.current = null;
          if (isScreenActive.current && retryCount.current < 2 && !isEnding) {
            retryCount.current += 1;
            console.log("[CallVolunteer] Retrying connecting message", {
              retryCount: retryCount.current,
            });
            setTimeout(() => speakConnectingMessage(), 500);
          }
        },
      });
    }, 3500); // 3500ms delay before speaking
  }, [isEnding, clearSpeechQueue]);

  useEffect(() => {
    if (!initialMeetingData) {
      const createGlobalCall = async () => {
        setIsLoading(true);
        await speakConnectingMessage();
        try {
          const response = await createMeeting(token, { type: "global" });
          if (!response?.data)
            throw new Error("Invalid response from server for global call.");
          setCallData(response.data);
        } catch (err) {
          console.log("[CallVolunteer] Create meeting error:", err, {
            platform: Platform.OS,
          });
          if (!speechInProgress.current && !isEnding) {
            speechInProgress.current = true;
            pendingSpeech.current = "no-volunteers";
            Speech.speak("Sorry, no volunteers are available right now.", {
              onDone: () => {
                console.log("[CallVolunteer] No volunteers message done");
                speechInProgress.current = false;
                pendingSpeech.current = null;
                if (isScreenActive.current) navigation.goBack();
              },
              onError: (err) => {
                console.log(
                  "[CallVolunteer] No volunteers message error:",
                  err,
                  { platform: Platform.OS }
                );
                speechInProgress.current = false;
                pendingSpeech.current = null;
                if (isScreenActive.current) navigation.goBack();
              },
            });
          }
        } finally {
          setIsLoading(false);
        }
      };
      createGlobalCall();
    }
  }, [initialMeetingData, token, navigation, speakConnectingMessage]);

  // Handle specific friend calls
  const speakCallingHelperMessage = useCallback(async () => {
    if (
      speechInProgress.current ||
      !isScreenActive.current ||
      retryCount.current >= 2 ||
      isEnding
    ) {
      console.log("[CallVolunteer] Skipped calling helper message:", {
        speechInProgress: speechInProgress.current,
        isScreenActive: isScreenActive.current,
        retryCount: retryCount.current,
        isEnding,
        platform: Platform.OS,
      });
      return;
    }

    await clearSpeechQueue();
    speechInProgress.current = true;
    pendingSpeech.current = "calling-helper";
    console.log("[CallVolunteer] Calling helper message initiated", {
      platform: Platform.OS,
    });
    const message = `Calling ${helperName}. Double-tap to flip the camera. Swipe down with two fingers to end the call. The front camera is active.`;
    Speech.speak(message, {
      language: "en-US",
      rate: 0.85,
      pitch: 1.0,
      onDone: () => {
        console.log("[CallVolunteer] Calling helper message done", {
          platform: Platform.OS,
        });
        speechInProgress.current = false;
        pendingSpeech.current = null;
        retryCount.current = 0;
      },
      onError: (err) => {
        console.log("[CallVolunteer] Calling helper message error:", err, {
          platform: Platform.OS,
        });
        speechInProgress.current = false;
        pendingSpeech.current = null;
        if (isScreenActive.current && retryCount.current < 2 && !isEnding) {
          retryCount.current += 1;
          console.log("[CallVolunteer] Retrying calling helper message", {
            retryCount: retryCount.current,
          });
          setTimeout(() => speakCallingHelperMessage(), 500);
        }
      },
    });
  }, [helperName, isEnding, clearSpeechQueue]);

  useEffect(() => {
    if (!helperName) return;

    const speakTimeout = setTimeout(() => {
      speakCallingHelperMessage();

      callTimeoutRef.current = setTimeout(() => {
        if (!speechInProgress.current && !isEnding) {
          speechInProgress.current = true;
          pendingSpeech.current = "no-answer";
          console.log("[CallVolunteer] Speaking: Helper did not answer", {
            platform: Platform.OS,
          });
          Speech.speak(`${helperName} did not answer in time.`, {
            onDone: () => {
              console.log("[CallVolunteer] No answer message done");
              speechInProgress.current = false;
              pendingSpeech.current = null;
              if (isScreenActive.current) handleEndCall();
            },
            onError: (err) => {
              console.log("[CallVolunteer] No answer message error:", err, {
                platform: Platform.OS,
              });
              speechInProgress.current = false;
              pendingSpeech.current = null;
              if (isScreenActive.current) handleEndCall();
            },
          });
        }
      }, 3500 + 30000);
    }, 2500);

    return () => {
      clearTimeout(speakTimeout);
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
      }
      Speech.stop();
    };
  }, [helperName, handleEndCall, speakCallingHelperMessage]);

  // Handle back navigation and cleanup
  useFocusEffect(
    useCallback(() => {
      isScreenActive.current = true;
      return () => {
        console.log("[CallVolunteer] Screen losing focus, ending call", {
          platform: Platform.OS,
        });
        isScreenActive.current = false;
        if (!isEnding) {
          handleEndCall();
        }
        Speech.stop();
        pendingSpeech.current = null;
        retryCount.current = 0;
        setIsFrontCamera(true);
      };
    }, [isEnding, handleEndCall])
  );

  const handleRemoteUserJoined = useCallback(() => {
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
    }
    if (!speechInProgress.current && !isEnding) {
      speechInProgress.current = true;
      pendingSpeech.current = "helper-joined";
      console.log("[CallVolunteer] Speaking: Helper joined", {
        platform: Platform.OS,
      });
      Speech.speak(`${helperName || "The helper"} has joined the call.`, {
        language: "en-US",
        rate: 0.85,
        pitch: 1.0,
        onDone: () => {
          console.log("[CallVolunteer] Helper joined message done");
          speechInProgress.current = false;
          pendingSpeech.current = null;
        },
        onError: (err) => {
          console.log("[CallVolunteer] Helper joined message error:", err, {
            platform: Platform.OS,
          });
          speechInProgress.current = false;
          pendingSpeech.current = null;
        },
      });
    }
  }, [helperName, isEnding]);

  const handleEndCall = useCallback(async () => {
    if (isEnding) return;
    setIsEnding(true);
    if (!speechInProgress.current) {
      await clearSpeechQueue();
      speechInProgress.current = true;
      pendingSpeech.current = "ending";
      console.log("[CallVolunteer] Speaking: Ending call", {
        platform: Platform.OS,
      });
      Speech.speak("Ending call.", {
        language: "en-US",
        rate: 0.85,
        pitch: 1.0,
        onDone: () => {
          console.log("[CallVolunteer] Ending call message done");
          speechInProgress.current = false;
          pendingSpeech.current = null;
        },
        onError: (err) => {
          console.log("[CallVolunteer] Ending call message error:", err, {
            platform: Platform.OS,
          });
          speechInProgress.current = false;
          pendingSpeech.current = null;
        },
      });
    }
    try {
      await agoraRef.current?.disconnect();
      const channel = callData?.roomName || callData?.channelName;
      if (channel) await endMeeting(token, channel);
    } catch (err) {
      console.error("[CallVolunteer] End call error:", err, {
        platform: Platform.OS,
      });
    } finally {
      setTimeout(() => {
        if (isScreenActive.current) {
          if (navigation.canGoBack()) navigation.goBack();
          else navigation.navigate("Support");
        }
      }, 1000);
    }
  }, [isEnding, callData, token, navigation, clearSpeechQueue]);

  const handleFlipCamera = useCallback(async () => {
    if (!speechInProgress.current && !isEnding) {
      await clearSpeechQueue();
      speechInProgress.current = true;
      pendingSpeech.current = "flipping-camera";
      const newCameraState = !isFrontCamera;
      console.log("[CallVolunteer] Speaking: Flipping camera", {
        newCameraState,
        platform: Platform.OS,
      });
      Speech.speak(
        `${
          newCameraState
            ? "The front camera is active"
            : "The back camera is active"
        }.`,
        {
          language: "en-US",
          rate: 0.85,
          pitch: 1.0,
          onDone: () => {
            console.log("[CallVolunteer] Flipping camera message done", {
              cameraState: newCameraState ? "front" : "back",
            });
            speechInProgress.current = false;
            pendingSpeech.current = null;
          },
          onError: (err) => {
            console.log("[CallVolunteer] Flipping camera message error:", err, {
              platform: Platform.OS,
            });
            speechInProgress.current = false;
            pendingSpeech.current = null;
          },
        }
      );
      agoraRef.current?.flipCamera();
      setIsFrontCamera(newCameraState);
      console.log("[CallVolunteer] Camera state:", {
        isFrontCamera: newCameraState,
        platform: Platform.OS,
      });
    }
  }, [isFrontCamera, isEnding, clearSpeechQueue]);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (!isEnding) {
        console.log("[CallVolunteer] Double-tap detected", {
          platform: Platform.OS,
        });
        runOnJS(handleFlipCamera)();
      }
    });

  const swipeDownGesture = Gesture.Pan()
    .minPointers(Platform.OS === "android" ? 1 : 2)
    .maxPointers(2)
    .minDistance(10)
    .activeOffsetY([40, 100])
    .onStart((event) => {
      console.log("[CallVolunteer] Swipe gesture started", {
        pointers: event.numberOfPointers,
        minPointers: Platform.OS === "android" ? 1 : 2,
        maxPointers: 2,
        platform: Platform.OS,
      });
      if (Platform.OS === "android" && event.numberOfPointers === 1) {
        console.log("[CallVolunteer] Android fallback: single-pointer swipe", {
          platform: Platform.OS,
        });
      }
    })
    .onEnd((event) => {
      console.log("[CallVolunteer] Swipe gesture evaluated:", {
        translationY: event.translationY,
        translationX: event.translationX,
        velocityY: event.velocityY,
        velocityX: event.velocityX,
        pointers: event.numberOfPointers,
        platform: Platform.OS,
      });
      const minPointers = Platform.OS === "android" ? 1 : 2;
      if (event.numberOfPointers < minPointers) {
        console.log(
          "[CallVolunteer] Pointer validation failed: insufficient pointers",
          { pointers: event.numberOfPointers, minPointers }
        );
        return;
      }
      const { translationY, velocityY } = event;
      if (translationY > 40 && velocityY > 600 && !isEnding) {
        console.log("[CallVolunteer] Swipe down detected, ending call");
        runOnJS(handleEndCall)();
      } else {
        console.log(
          "[CallVolunteer] Swipe gesture ignored: thresholds not met",
          { translationY, velocityY, platform: Platform.OS }
        );
      }
    })
    .withRef(gestureRef);

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
            {isEnding
              ? "Ending..."
              : isLoading
              ? "Connecting..."
              : "Call information is incomplete."}
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
