import React, { useEffect, useCallback, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  SafeAreaView,
  Animated,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";

import { useUser } from "../../store/UserContext";
import { useSeeker } from "../../store/SeekerContext";
import { useAuth } from "../../store/AuthContext";
import { useVoiceAssistant } from "../../store/VoiceAssistantContext";

import CallButton from "../../components/seeker/CallButton";
import ArrowButton from "../../components/UI/ArrowButton";
import Colors from "../../constants/Colors";

const Support = ({ navigation }) => {
  const {
    isListening,
    status,
    error,
    partialText,
    finalText,
    startRecognition,
    stopRecognition,
    resetState,
  } = useVoiceAssistant();

  const { user } = useUser();
  const { friends, callSpecificFriend } = useSeeker();
  const { token } = useAuth();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isScreenActive = useRef(true);
  const speechInProgress = useRef(false);
  const swipeTimeout = useRef(null);
  const lastProcessedText = useRef("");
  const [triggerSwipe, setTriggerSwipe] = useState(false);
  const [backPressCount, setBackPressCount] = useState(0);
  const backPressTimeout = useRef(null);

  // Clear speech queue with timeout
  const clearSpeechQueue = useCallback(async () => {
    if (await Speech.isSpeakingAsync()) {
      console.log('[Support] Speech active, stopping existing', { platform: Platform.OS });
      await Speech.stop();
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('[Support] Speech queue cleared', { platform: Platform.OS });
    }
  }, []);

  useEffect(() => {
    if (isListening && isScreenActive.current) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.spring(pulseAnim, { toValue: 1, useNativeDriver: true }).start();
    }
  }, [isListening, pulseAnim]);

  // Handle back navigation
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!isScreenActive.current || speechInProgress.current) {
        console.log('[Support] Back press ignored:', {
          isScreenActive: isScreenActive.current,
          speechInProgress: speechInProgress.current,
        });
        return true; // Prevent default back behavior
      }

      if (backPressCount === 0) {
        console.log('[Support] First back press detected');
        setBackPressCount(1);
        clearSpeechQueue().then(() => {
          speechInProgress.current = true;
          const name = user?.lastName || "My Friend";
          const welcomeMessage = `Hello ${name}, You are in Support Screen. Swipe down with two fingers to give a voice command. Press back twice to exit the app.`;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch((err) => {
            console.log('[Support] Haptics error:', err);
          });
          Speech.speak(welcomeMessage, {
            language: "en-US",
            rate: 0.85,
            pitch: 1.0,
            onDone: () => {
              console.log('[Support] Back press welcome message done');
              speechInProgress.current = false;
            },
            onError: (err) => {
              console.log('[Support] Back press welcome message error:', err);
              speechInProgress.current = false;
            },
          });
        });

        // Reset back press count after 2 seconds
        backPressTimeout.current = setTimeout(() => {
          console.log('[Support] Resetting back press count');
          setBackPressCount(0);
        }, 2000);

        return true; // Prevent default back behavior
      } else if (backPressCount === 1) {
        console.log('[Support] Second back press detected, exiting app');
        clearSpeechQueue().then(() => {
          if (backPressTimeout.current) {
            clearTimeout(backPressTimeout.current);
            backPressTimeout.current = null;
          }
          if (Platform.OS === 'android') {
            BackHandler.exitApp();
          } else {
            // iOS: Navigate to parent or home screen (assuming Support is root)
            console.log('[Support] iOS back navigation not fully supported');
            navigation.goBack();
          }
        });
        return true; // Prevent default back behavior
      }

      return false;
    });

    return () => {
      backHandler.remove();
      if (backPressTimeout.current) {
        clearTimeout(backPressTimeout.current);
        backPressTimeout.current = null;
      }
    };
  }, [backPressCount, clearSpeechQueue, navigation, user]);

  useFocusEffect(
    useCallback(() => {
      isScreenActive.current = true;
      if (!speechInProgress.current) {
        speechInProgress.current = true;
        console.log("[Support] Speaking welcome message");
        const name = user?.lastName || "My Friend";
        const welcomeMessage = `Hello ${name}, You are in Support Screen. Swipe down with two fingers to give a voice command.`;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch((err) => {
          console.log('[Support] Haptics error:', err);
        });
        clearSpeechQueue().then(() => {
          Speech.speak(welcomeMessage, {
            language: "en-US",
            rate: 0.85,
            pitch: 1.0,
            onDone: () => {
              console.log("[Support] Welcome message done");
              speechInProgress.current = false;
            },
            onError: (err) => {
              console.log("[Support] Welcome message error:", err);
              speechInProgress.current = false;
            },
          });
        });
      } else {
        console.log("[Support] Skipped welcome message due to speechInProgress");
      }

      return () => {
        console.log("[Support] Screen losing focus, cleaning up");
        isScreenActive.current = false;
        speechInProgress.current = false;
        Speech.stop();
        stopRecognition();
        resetState();
        if (swipeTimeout.current) {
          clearTimeout(swipeTimeout.current);
          swipeTimeout.current = null;
        }
        lastProcessedText.current = "";
      };
    }, [stopRecognition, resetState, user, clearSpeechQueue])
  );

  useEffect(() => {
    if (
      status !== "processing" ||
      !finalText ||
      finalText === lastProcessedText.current ||
      speechInProgress.current ||
      !isScreenActive.current
    ) {
      console.log("[Support] Skipping command processing:", {
        status,
        finalText,
        lastProcessedText: lastProcessedText.current,
        speechInProgress: speechInProgress.current,
        isScreenActive: isScreenActive.current,
      });
      return;
    }

    lastProcessedText.current = finalText;
    const normalized = finalText
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .trim();
    console.log("[Support] Processing command:", normalized);

    speechInProgress.current = true;
    let feedbackSpeech = "";
    let navigationAction = null;

    if (
      normalized.includes("need") ||
      normalized.includes("volunteer") ||
      normalized.includes("help") ||
      normalized.includes("support") ||
      normalized.includes("call a volunteer")
    ) {
      feedbackSpeech = "Calling a volunteer.";
      navigationAction = () => navigation.navigate("CallVolunteer");
    } else if (normalized.startsWith("call ")) {
      const friendName = normalized.replace("call ", "").trim();
      const friendToCall = friends.find((f) => {
        const fullName = `${f.customFirstName} ${f.customLastName}`.toLowerCase();
        const firstName = f.customFirstName.toLowerCase();
        const lastName = f.customLastName.toLowerCase();
        return (
          fullName.includes(friendName) ||
          firstName.includes(friendName) ||
          lastName.includes(friendName) ||
          friendName.includes(firstName) ||
          friendName.includes(lastName)
        );
      });

      if (friendToCall) {
        feedbackSpeech = `Calling ${friendToCall.customLastName}.`;
        navigationAction = () => callSpecificFriend(friendToCall, token, navigation);
      } else {
        feedbackSpeech = `Sorry, I could not find a friend named ${friendName}.`;
      }
    } else if (
      normalized.includes("my vision") ||
      normalized.includes("my vision board") ||
      normalized.includes("want to take a picture")
    ) {
      feedbackSpeech = "Opening My Vision.";
      navigationAction = () => navigation.navigate("MyVision");
    } else if (
      normalized.includes("my people") ||
      normalized.includes("my contacts")
    ) {
      feedbackSpeech = "Opening My People.";
      navigationAction = () => navigation.navigate("MyPeople");
    } else if (normalized.includes("settings")) {
      feedbackSpeech = "Opening Settings.";
      navigationAction = () => navigation.navigate("Settings");
    } else if (
      normalized.includes("list friends") ||
      normalized.includes("who are my friends")
    ) {
      feedbackSpeech = friends.length === 0
        ? "You currently have no friends added."
        : `You have ${friends.length} friend${friends.length === 1 ? "" : "s"}: ${friends
            .map((f) => f.customLastName)
            .slice(0, 5)
            .join(", ")}.`;
      console.log("[Support] Listing friends:", feedbackSpeech);
    } else {
      feedbackSpeech = "Sorry, I didn't understand.";
    }

    Speech.speak(feedbackSpeech, {
      language: "en-US",
      rate: 0.85,
      pitch: 1.0,
      onDone: () => {
        console.log("[Support] Feedback speech done");
        speechInProgress.current = false;
        if (isScreenActive.current) {
          if (navigationAction) {
            console.log("[Support] Executing navigation action");
            navigationAction();
          }
          setTimeout(() => resetState(), 300);
        }
      },
      onError: (err) => {
        console.log("[Support] Feedback speech error:", err);
        speechInProgress.current = false;
        if (isScreenActive.current) {
          if (navigationAction) {
            console.log("[Support] Executing navigation action after speech error");
            navigationAction();
          }
          resetState();
        }
      },
    });
  }, [
    finalText,
    status,
    navigation,
    friends,
    callSpecificFriend,
    token,
    resetState,
  ]);

  useEffect(() => {
    if (
      error &&
      isScreenActive.current &&
      !error.includes("Didn't understand")
    ) {
      console.log("[Support] Displaying error:", error);
      setTimeout(() => {
        if (isScreenActive.current) {
          console.log("[Support] Clearing error");
          resetState();
        }
      }, 3000);
    } else if (error && error.includes("Didn't understand")) {
      console.log("[Support] Skipping error 11 display:", error);
    }
  }, [error, resetState]);

  useEffect(() => {
    if (!triggerSwipe) return;

    if (!isScreenActive.current || speechInProgress.current) {
      console.log("[Support] Swipe ignored:", {
        isScreenActive: isScreenActive.current,
        speechInProgress: speechInProgress.current,
      });
      setTriggerSwipe(false);
      return;
    }

    if (swipeTimeout.current) {
      console.log("[Support] Clearing previous swipe timeout");
      clearTimeout(swipeTimeout.current);
    }

    console.log("[Support] Swipe detected, triggering haptics");
    swipeTimeout.current = setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch((err) => {
        console.log("[Support] Haptics error:", err);
      });
      if (!isListening && status !== "listening") {
        speechInProgress.current = true;
        console.log("[Support] Speaking: I'm listening", {
          status,
          isListening,
        });
        Speech.speak("I'm listening, you can speak now.", {
          language: "en-US",
          rate: 0.85,
          pitch: 1.0,
          onDone: () => {
            console.log("[Support] Listening message done");
            speechInProgress.current = false;
            if (isScreenActive.current && !isListening) {
              startRecognition();
            }
          },
          onError: (err) => {
            console.log("[Support] Listening message error:", err);
            speechInProgress.current = false;
            if (isScreenActive.current) {
              resetState();
            }
          },
        });
      } else {
        console.log("[Support] Stopping recognition due to swipe");
        stopRecognition();
      }
      setTriggerSwipe(false);
    }, 200);
  }, [
    triggerSwipe,
    isListening,
    status,
    startRecognition,
    stopRecognition,
    resetState,
  ]);

  const panGesture = Gesture.Pan()
    .minPointers(Platform.OS === "android" ? 1 : 2)
    .maxPointers(2)
    .minDistance(15)
    .onStart((event) => {
      console.log("[Support] Gesture started", {
        pointers: event.numberOfPointers,
        minPointers: Platform.OS === "android" ? 1 : 2,
        maxPointers: 2,
        platform: Platform.OS,
      });
      if (Platform.OS === "android" && event.numberOfPointers === 1) {
        console.log("[Support] Android fallback: single-pointer swipe", { platform: Platform.OS });
      }
    })
    .onEnd((event) => {
      console.log("[Support] Pan gesture evaluated:", {
        translationY: event.translationY,
        translationX: event.translationX,
        velocityY: event.velocityY,
        velocityX: event.velocityX,
        pointers: event.numberOfPointers,
      });
      const minPointers = Platform.OS === "android" ? 1 : 2;
      if (event.numberOfPointers < minPointers) {
        console.log("[Support] Pointer validation failed: insufficient pointers", {
          pointers: event.numberOfPointers,
          minPointers,
        });
        return;
      }
      if (
        event.translationY > 20 &&
        Math.abs(event.translationX) < event.translationY * 1.5 &&
        isScreenActive.current
      ) {
        console.log("[Support] Pan gesture triggered");
        runOnJS(setTriggerSwipe)(true);
      } else {
        console.log("[Support] Pan gesture ignored");
      }
    });

  return (
    <SafeAreaView style={styles.safeArea}>
      <GestureDetector gesture={panGesture}>
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.topContent}>
              <View style={styles.TitleContainer}>
                <Text style={styles.title}>Optima</Text>
              </View>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <CallButton
                  onPress={() => navigation.navigate("CallVolunteer")}
                />
              </Animated.View>
              <ArrowButton
                text={"MY VISION"}
                type={"MyVision"}
                onPress={() => navigation.navigate("MyVision")}
              />
              <ArrowButton
                text={"MY PEOPLE"}
                type={"MyPeople"}
                onPress={() => navigation.navigate("MyPeople")}
              />
            </View>

            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                Swipe down with two fingers to give a voice command.
              </Text>
              {isListening && isScreenActive.current && (
                <Text style={styles.listeningText}>Listening...</Text>
              )}
              {partialText && isScreenActive.current && (
                <Text style={styles.partialText}>Hearing: {partialText}</Text>
              )}
              {error &&
                isScreenActive.current &&
                !error.includes("Didn't understand") && (
                  <Text style={styles.errorText}>Error: {error}</Text>
                )}
            </View>
          </ScrollView>
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
};

export default Support;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 30,
    alignItems: "center",
  },
  topContent: {
    width: "100%",
    alignItems: "center",
  },
  TitleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: Platform.OS === "ios" ? 32 : 28,
    color: Colors.MainColor,
    fontWeight: "400",
  },
  instructionContainer: {
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  listeningText: {
    fontSize: 16,
    color: Colors.MainColor,
    fontWeight: "600",
    marginTop: 10,
  },
  partialText: {
    fontSize: 14,
    color: Colors.MainColor,
    textAlign: "center",
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
    color: Colors.red,
    textAlign: "center",
    marginTop: 10,
  },
});