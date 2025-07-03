import React, { useEffect, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MyPeopleContent from "../../components/seeker/MyPeople/MyPeopleContent";
import Colors from "../../constants/Colors";
import ScreenWrapper from "../../components/UI/ScreenWrapper";

// 1. Import Gesture Handler and related tools
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import * as Haptics from 'expo-haptics';

import { useVoiceAssistant } from "../../hooks/useVoiceAssistant";
import { useSeeker } from "../../store/SeekerContext";
import { useAuth } from "../../store/AuthContext";
import * as Speech from "expo-speech";

const MyPeople = ({ navigation }) => {
  const {
    isListening,
    finalText,
    startRecognition,
    stopRecognition,
    resetState,
  } = useVoiceAssistant();
  const { friends, callSpecificFriend } = useSeeker();
  const { token } = useAuth();

  // This hook now only handles cleanup when the user navigates away
  useFocusEffect(
    useCallback(() => {
      // Speak instructions when the user first enters the screen
      Speech.speak("You are on the My People screen. Swipe down with two fingers to call a friend by name.");
      
      return () => {
        stopRecognition();
        Speech.stop();
      };
    }, [stopRecognition])
  );

  // Process the recognized voice command
  useEffect(() => {
    if (finalText) {
      const command = finalText.toLowerCase().trim();
      let feedbackSpeech = "";

      if (command.startsWith("call ")) {
        const friendName = command.replace("call ", "").toLowerCase();
        
        const friendToCall = friends.find(f => 
          `${f.customFirstName} ${f.customLastName}`.toLowerCase().includes(friendName)
        );

        if (friendToCall) {
          feedbackSpeech = `Calling ${friendToCall.customLastName}.`;
          callSpecificFriend(friendToCall, token, navigation);
        } else {
          feedbackSpeech = `Sorry, I could not find a friend named ${friendName}.`;
        }
      } else {
        feedbackSpeech = "Sorry, I didn't understand that command.";
      }

      // Give spoken feedback and then reset the state.
      // The user will swipe again to issue a new command.
      Speech.speak(feedbackSpeech, { 
        onDone: () => {
          resetState();
        }
      });
    }
  }, [finalText, navigation, resetState, friends, callSpecificFriend, token]);

  // 2. Define the function to handle the swipe gesture
  const handleSwipe = () => {
    if (!isListening) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Speech.speak("I'm listening", {
        onDone: () => {
          startRecognition();
        },
      });
    }
  };

  // 3. Create the gesture recognizer
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
    <ScreenWrapper>
      {/* 4. Wrap the main view with the GestureDetector */}
      <GestureDetector gesture={panGesture}>
        <View style={styles.container}>
          <MyPeopleContent navigation={navigation} />
          {/* Optional: Add a subtle visual instruction at the bottom */}
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Swipe down with two fingers to speak
            </Text>
          </View>
        </View>
      </GestureDetector>
    </ScreenWrapper>
  );
};

export default MyPeople;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(245, 245, 245, 0.9)',
    alignItems: 'center',
  },
  instructionText: {
    color: '#666',
    fontSize: 14,
  }
});
