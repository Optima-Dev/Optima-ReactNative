import React, { useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  SafeAreaView,
  Animated,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

import CallButton from "../../components/seeker/CallButton";
import Colors from "../../constants/Colors";
import ArrowButton from "../../components/UI/ArrowButton";
import { useVoiceAssistant } from "../../hooks/useVoiceAssistant";
import * as Speech from "expo-speech";
import ScreenWrapper from "../../components/UI/ScreenWrapper";

const Support = ({ navigation }) => {
  const {
    status,
    isListening,
    finalText,
    startRecognition,
    stopRecognition,
    resetState,
  } = useVoiceAssistant();

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === "listening") {
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
      pulseAnim.stopAnimation();
      Animated.spring(pulseAnim, { toValue: 1, useNativeDriver: true }).start();
    }
  }, [status, pulseAnim]);

  // Stop listening when the user navigates away
  useFocusEffect(
    useCallback(() => {
      return () => {
        stopRecognition();
      };
    }, [stopRecognition])
  );

  // Process the final voice command
  useEffect(() => {
    if (finalText) {
      const command = finalText.toLowerCase().trim();
      let feedbackSpeech = "";

      if (command.includes("call volunteer")) {
        feedbackSpeech = "Calling a volunteer.";
        navigation.navigate("CallVolunteer");
      } else if (command.includes("my vision")) {
        feedbackSpeech = "Opening My Vision.";
        navigation.navigate("MyVision");
      } else if (command.includes("my people")) {
        feedbackSpeech = "Opening My People.";
        navigation.navigate("MyPeople");
      } else {
        feedbackSpeech = `Sorry, I didn't understand. Please try again.`;
      }

      Speech.speak(feedbackSpeech, { onDone: () => resetState() });
    }
  }, [finalText, navigation, resetState]);

  // This function now handles the swipe gesture logic
  const handleSwipe = () => {
    if (!isListening) {
      console.log("⬇️ Two-finger swipe down detected!");
      Speech.speak("I'm listening", {
        onDone: () => {
          startRecognition();
        },
      });
    }
  };

  // ===================================================================
  // THE FIX: Replaced the sensitive Fling gesture with a more robust Pan gesture.
  // This will more reliably detect a two-finger downward swipe.
  // ===================================================================
  const panGesture = Gesture.Pan()
    .minPointers(2) // Require two fingers
    .onEnd((event) => {
      // Check if the swipe was primarily downward and long enough
      if (
        event.translationY > 50 &&
        Math.abs(event.translationX) < event.translationY
      ) {
        runOnJS(handleSwipe)();
      }
    });

  return (
    <SafeAreaView style={styles.safeArea}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.container}>
          <View style={styles.topContent}>
            <View style={styles.TitleContainer}>
              <Text style={styles.title}>Optima</Text>
            </View>
            <CallButton onPress={() => navigation.navigate("CallVolunteer")} />

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
          </View>

          <View style={styles.voiceContainer}>
            <Animated.View
              style={[styles.micButton, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.micText}>🎤</Text>
            </Animated.View>
          </View>
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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 40,
    paddingBottom: 40,
    alignItems: "center",
    justifyContent: "space-between",
  },
  topContent: {
    width: "100%",
    alignItems: "center",
  },
  TitleContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: Platform.OS === "ios" ? 32 : 28,
    color: Colors.MainColor,
    fontWeight: "400",
  },
  instructionContainer: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    width: "100%",
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  voiceContainer: {
    position: "absolute",
    bottom: 40,
    right: 20,
  },
  micButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.MainColor,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: Colors.MainColor,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  micText: {
    fontSize: 30,
  },
});
