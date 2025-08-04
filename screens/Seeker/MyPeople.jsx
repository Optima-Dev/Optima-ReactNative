import React, { useEffect, useCallback, useRef, useState } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Speech from "expo-speech";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

import { useSeeker } from "../../store/SeekerContext";
import { useAuth } from "../../store/AuthContext";
import { useVoiceAssistant } from "../../store/VoiceAssistantContext";
import MyPeopleContent from "../../components/seeker/MyPeople/MyPeopleContent";
import Colors from "../../constants/Colors";
import ScreenWrapper from "../../components/UI/ScreenWrapper";

const MyPeople = ({ navigation }) => {
  const { error, resetState } = useVoiceAssistant();
  const { friends } = useSeeker();

  const isScreenActive = useRef(true);
  const speechInProgress = useRef(false);
  const retryCount = useRef(0);
  const gestureRef = useRef(null);

  const speakWelcomeMessage = useCallback(async () => {
    if (
      speechInProgress.current ||
      !isScreenActive.current ||
      retryCount.current >= 2
    ) {
      console.log("[MyPeople] Skipped welcome message:", {
        speechInProgress: speechInProgress.current,
        isScreenActive: isScreenActive.current,
        retryCount: retryCount.current,
        platform: Platform.OS,
      });
      return;
    }

    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      console.log("[MyPeople] Speech active, stopping existing", {
        platform: Platform.OS,
      });
      await Speech.stop();
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    speechInProgress.current = true;
    console.log("[MyPeople] Welcome message initiated", {
      platform: Platform.OS,
    });
    const welcomeMessage =
      "Welcome to My People. Swipe down with two fingers to hear your friends list.";
    Speech.speak(welcomeMessage, {
      language: "en-US",
      rate: 0.85,
      pitch: 1.0,
      onDone: () => {
        console.log("[MyPeople] Welcome message done", {
          platform: Platform.OS,
        });
        speechInProgress.current = false;
        retryCount.current = 0;
      },
      onError: (err) => {
        console.log("[MyPeople] Welcome message error:", err, {
          platform: Platform.OS,
        });
        speechInProgress.current = false;
        if (isScreenActive.current && retryCount.current < 2) {
          retryCount.current += 1;
          console.log("[MyPeople] Retrying welcome message", {
            retryCount: retryCount.current,
          });
          setTimeout(() => speakWelcomeMessage(), 1000);
        }
      },
    });
  }, []);

  const speakFriendList = useCallback(async () => {
    if (
      speechInProgress.current ||
      !isScreenActive.current ||
      retryCount.current >= 2
    ) {
      console.log("[MyPeople] Skipped friend list speech:", {
        speechInProgress: speechInProgress.current,
        isScreenActive: isScreenActive.current,
        retryCount: retryCount.current,
        platform: Platform.OS,
      });
      return;
    }

    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      console.log(
        "[MyPeople] Speech active for friend list, stopping existing",
        { platform: Platform.OS }
      );
      await Speech.stop();
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    speechInProgress.current = true;
    const friendListMessage =
      friends.length === 0
        ? "You currently have no friends added."
        : `You have ${friends.length} friend${
            friends.length === 1 ? "" : "s"
          }: ${friends
            .map((f) => f.customLastName)
            .slice(0, 5)
            .join(", ")}.`;
    console.log("[MyPeople] Speaking friend list:", friendListMessage, {
      platform: Platform.OS,
    });
    Speech.speak(friendListMessage, {
      language: "en-US",
      rate: 0.85,
      pitch: 1.0,
      onDone: () => {
        console.log("[MyPeople] Friend list speech done", {
          platform: Platform.OS,
        });
        speechInProgress.current = false;
        retryCount.current = 0;
      },
      onError: (err) => {
        console.log("[MyPeople] Friend list speech error:", err, {
          platform: Platform.OS,
        });
        speechInProgress.current = false;
        if (isScreenActive.current && retryCount.current < 2) {
          retryCount.current += 1;
          console.log("[MyPeople] Retrying friend list speech", {
            retryCount: retryCount.current,
          });
          setTimeout(() => speakFriendList(), 1000);
        }
      },
    });
  }, [friends]);

  useFocusEffect(
    useCallback(() => {
      isScreenActive.current = true;
      console.log("[MyPeople] Screen focused, triggering welcome message", {
        platform: Platform.OS,
      });
      const timer = setTimeout(() => {
        if (isScreenActive.current) {
          speakWelcomeMessage();
        }
      }, 500);

      return () => {
        console.log("[MyPeople] Cleaning up on screen blur", {
          platform: Platform.OS,
        });
        clearTimeout(timer);
        isScreenActive.current = false;
        speechInProgress.current = false;
        Speech.stop();
        retryCount.current = 0;
        resetState();
      };
    }, [speakWelcomeMessage, resetState])
  );

  useEffect(() => {
    if (
      error &&
      isScreenActive.current &&
      !error.includes("Didn't understand")
    ) {
      console.log("[MyPeople] Displaying error:", error, {
        platform: Platform.OS,
      });
      setTimeout(() => {
        if (isScreenActive.current) {
          console.log("[MyPeople] Clearing error");
          resetState();
        }
      }, 3000);
    } else if (error && error.includes("Didn't understand")) {
      console.log("[MyPeople] Skipping error 11 display:", error, {
        platform: Platform.OS,
      });
    }
  }, [error, resetState]);

  const handleSwipe = (direction) => {
    console.log("[MyPeople] Swipe detected:", direction, {
      platform: Platform.OS,
    });
    if (direction === "down" && !speechInProgress.current) {
      console.log("[MyPeople] Swipe down processed, triggering friend list");
      speakFriendList();
    } else {
      console.log("[MyPeople] Swipe ignored:", {
        direction,
        speechInProgress: speechInProgress.current,
        platform: Platform.OS,
      });
    }
  };

  const panGesture = Gesture.Pan()
    .minPointers(Platform.OS === "android" ? 1 : 2)
    .maxPointers(2)
    .minDistance(10)
    .activeOffsetY([-10, 10])
    .onStart((event) => {
      console.log("[MyPeople] Gesture started", {
        pointers: event.numberOfPointers,
        minPointers: Platform.OS === "android" ? 1 : 2,
        maxPointers: 2,
        platform: Platform.OS,
      });
      if (Platform.OS === "android" && event.numberOfPointers === 1) {
        console.log("[MyPeople] Android fallback: single-pointer swipe", {
          platform: Platform.OS,
        });
      }
    })
    .onEnd((event) => {
      console.log("[MyPeople] Pan gesture evaluated:", {
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
          "[MyPeople] Pointer validation failed: insufficient pointers",
          { pointers: event.numberOfPointers, minPointers }
        );
        return;
      }
      const verticalSwipe = event.translationY;
      const horizontalSwipe = event.translationX;

      if (
        Math.abs(verticalSwipe) > 40 &&
        Math.abs(verticalSwipe) > Math.abs(horizontalSwipe)
      ) {
        const direction = verticalSwipe > 0 ? "down" : "up";
        runOnJS(handleSwipe)(direction);
      } else {
        console.log("[MyPeople] Pan gesture ignored", {
          platform: Platform.OS,
        });
      }
    })
    .withRef(gestureRef);

  return (
    <ScreenWrapper>
      <GestureDetector gesture={panGesture}>
        <View style={styles.container}>
          <MyPeopleContent navigation={navigation} />
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
  feedbackContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  errorText: {
    fontSize: 14,
    color: Colors.red,
    textAlign: "center",
    marginTop: 8,
  },
});