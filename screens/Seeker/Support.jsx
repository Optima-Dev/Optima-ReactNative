import React, { useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  SafeAreaView,
  Animated,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

// 1. Import the necessary contexts to get user data and actions
import { useUser } from "../../store/UserContext";
import { useSeeker } from "../../store/SeekerContext";
import { useAuth } from "../../store/AuthContext";

import CallButton from "../../components/seeker/CallButton";
import Colors from "../../constants/Colors";
import ArrowButton from "../../components/UI/ArrowButton";
import { useVoiceAssistant } from "../../hooks/useVoiceAssistant";
import * as Speech from "expo-speech";

const Support = ({ navigation }) => {
  const {
    isListening,
    finalText,
    startRecognition,
    stopRecognition,
    resetState,
  } = useVoiceAssistant();

  // 2. Get the data and functions from your contexts
  const { user } = useUser();
  const { friends, callSpecificFriend } = useSeeker();
  const { token } = useAuth();
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const hasSpokenWelcome = useRef(false);

  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
      ).start();
    } else {
      Animated.spring(pulseAnim, { toValue: 1, useNativeDriver: true }).start();
    }
  }, [isListening, pulseAnim]);

  useFocusEffect(
    useCallback(() => {
      if (!hasSpokenWelcome.current) {
        const name = user?.firstName || "My Friend";
        const welcomeMessage = `Hello ${name}. Swipe down with two fingers to give a voice command.`;
        Speech.speak(welcomeMessage);
        hasSpokenWelcome.current = true;
      }

      return () => {
        stopRecognition();
        hasSpokenWelcome.current = false; 
      };
    }, [stopRecognition, user])
  );

  // 3. Update the command processing logic
  useEffect(() => {
    if (finalText) {
      const command = finalText.toLowerCase().trim();
      let feedbackSpeech = "";

      // Check for the "call [name]" command first
      if (command.startsWith("call ")) {
        const friendName = command.replace("call ", "").toLowerCase();
        
        // Find the friend in the list from the context
        const friendToCall = friends.find(f => 
          `${f.customFirstName} ${f.customLastName}`.toLowerCase().includes(friendName)
        );

        if (friendToCall) {
          feedbackSpeech = `Calling ${friendToCall.customFirstName}.`;
          // Use the centralized function from the context to make the call
          callSpecificFriend(friendToCall, token, navigation);
        } else {
          feedbackSpeech = `Sorry, I could not find a friend named ${friendName}.`;
        }
      } 
      // Fallback to other commands
      else if (command.includes("call") && command.includes("volunteer")) {
        feedbackSpeech = "Calling a volunteer.";
        navigation.navigate("CallVolunteer");
      } else if (command.includes("my") && command.includes("vision")) {
        feedbackSpeech = "Opening My Vision.";
        navigation.navigate("MyVision");
      } else if (command.includes("my") && command.includes("people")) {
        feedbackSpeech = "Opening My People.";
        navigation.navigate("MyPeople");
      } else {
        feedbackSpeech = `Sorry, I didn't understand. Please try again.`;
      }

      Speech.speak(feedbackSpeech, { onDone: () => resetState() });
    }
  }, [finalText, navigation, resetState, friends, callSpecificFriend, token]);

  const handleSwipe = () => {
    if (!isListening) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      Speech.speak("I'm listening, you could speak now", {
        onDone: () => {
          startRecognition();
        },
      });
    }
  };

  const panGesture = Gesture.Pan()
    .minPointers(2)
    .onEnd((event) => {
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
        {/* The root view now allows the voice container to float on top */}
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
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
  // This container is now for the ScrollView content
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
    width: '100%',
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  // Styles for the floating mic are restored
  voiceContainer: {
    position: "absolute",
    bottom: 40,
    right: 20,
  },
});
