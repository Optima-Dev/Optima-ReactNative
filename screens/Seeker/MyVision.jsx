import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { CameraView } from "expo-camera";
import { BallIndicator } from "react-native-indicators";
import { readAsStringAsync, EncodingType } from "expo-file-system";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Colors from "../../constants/Colors";
import { GOOGLE_API_KEY } from "@env";
import * as Speech from "expo-speech";
import ScreenWrapper from "../../components/UI/ScreenWrapper";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import PrimaryButton from "../../components/UI/PrimaryButton";
import * as Haptics from "expo-haptics";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Suppress console errors
console.error = () => {};

const MyVision = ({ navigation }) => {
  const [visionState, setVisionState] = useState({
    isCameraActive: true,
    uri: null,
    isLoading: false,
    answer: "",
  });

  const cameraRef = useRef();
  const hasSpokenIntro = useRef(false);
  const abortControllerRef = useRef(null);
  const speechInProgress = useRef(false);
  const firstMount = useRef(true);
  const retryCount = useRef(0);

  const updateVisionState = (updates) =>
    setVisionState((prev) => ({ ...prev, ...updates }));

  const cancelSpeech = useCallback(() => {
    Speech.stop();
    console.log("[MyVision] Speech stopped");
  }, []);

  const speakIntroMessage = useCallback(async () => {
    if (
      speechInProgress.current ||
      !visionState.isCameraActive ||
      retryCount.current >= 2
    ) {
      console.log("[MyVision] Skipped intro message:", {
        speechInProgress: speechInProgress.current,
        isCameraActive: visionState.isCameraActive,
        retryCount: retryCount.current,
      });
      return;
    }

    // Check if speech is active and stop it
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      console.log("[MyVision] Speech active, stopping existing");
      Speech.stop();
    }

    speechInProgress.current = true;
    console.log("[MyVision] Intro message initiated", {
      platform: Platform.OS,
    });
    const introMessage =
      "My Vision is active. Swipe up to take a picture. After that, swipe up to retake or swipe down to repeat the description.";
    Speech.speak(introMessage, {
      onDone: () => {
        console.log("[MyVision] Intro message done");
        speechInProgress.current = false;
        hasSpokenIntro.current = true;
        retryCount.current = 0;
        firstMount.current = false;
      },
      onError: (err) => {
        console.log("[MyVision] Intro message error:", err, {
          platform: Platform.OS,
        });
        speechInProgress.current = false;
        if (visionState.isCameraActive && retryCount.current < 2) {
          retryCount.current += 1;
          console.log("[MyVision] Retrying intro message", {
            retryCount: retryCount.current,
          });
          setTimeout(() => speakIntroMessage(), 1000);
        }
      },
    });
  }, [visionState.isCameraActive]);

  useEffect(() => {
    if (firstMount.current && visionState.isCameraActive) {
      console.log("[MyVision] First mount, triggering intro message");
      speakIntroMessage();
    }
  }, [speakIntroMessage, visionState.isCameraActive]);

  useFocusEffect(
    useCallback(() => {
      updateVisionState({ isCameraActive: true });
      console.log("[MyVision] Screen focused");
      if (!hasSpokenIntro.current) {
        speakIntroMessage();
      }

      return () => {
        console.log("[MyVision] Screen losing focus, cleaning up");
        updateVisionState({
          isCameraActive: true,
          uri: null,
          isLoading: false,
          answer: "",
        });
        if (abortControllerRef.current) {
          console.log("[MyVision] Cancelling image analysis");
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
        cancelSpeech();
        speechInProgress.current = false;
        hasSpokenIntro.current = false;
        firstMount.current = true;
        retryCount.current = 0;
      };
    }, [cancelSpeech, speakIntroMessage])
  );

  const getInfoFromAi = useCallback(
    async (imageUri) => {
      if (!imageUri || visionState.isLoading) return;
      cancelSpeech();
      updateVisionState({ isLoading: true });
      speechInProgress.current = true;
      console.log("[MyVision] Speaking: Analyzing image");
      Speech.speak("Analyzing image.", {
        onDone: () => {
          console.log("[MyVision] Analyzing image speech done");
          speechInProgress.current = false;
        },
        onError: (err) => {
          console.log("[MyVision] Analyzing image speech error:", err, {
            platform: Platform.OS,
          });
          speechInProgress.current = false;
        },
      });
      try {
        abortControllerRef.current = new AbortController();
        const base64Image = await readAsStringAsync(imageUri, {
          encoding: EncodingType.Base64,
        });
        const imagePart = {
          inlineData: { mimeType: "image/jpeg", data: base64Image },
        };
        const result = await model.generateContent(
          [
            "Describe this image in detail for a visually impaired person.",
            imagePart,
          ],
          { signal: abortControllerRef.current.signal }
        );
        const responseText = result.response.text();
        updateVisionState({ answer: responseText });
        speechInProgress.current = true;
        console.log("[MyVision] Speaking image description");
        Speech.speak(responseText, {
          onDone: () => {
            console.log("[MyVision] Image description speech done");
            speechInProgress.current = false;
          },
          onError: (err) => {
            console.log("[MyVision] Image description speech error:", err, {
              platform: Platform.OS,
            });
            speechInProgress.current = false;
          },
        });
        console.log("[MyVision] Image analysis completed");
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("[MyVision] Image analysis aborted");
          speechInProgress.current = true;
          Speech.speak("Image analysis cancelled.", {
            onDone: () => {
              console.log("[MyVision] Analysis cancelled speech done");
              speechInProgress.current = false;
            },
            onError: (err) => {
              console.log("[MyVision] Analysis cancelled speech error:", err, {
                platform: Platform.OS,
              });
              speechInProgress.current = false;
            },
          });
        } else {
          console.log("[MyVision] Image analysis error:", error, {
            platform: Platform.OS,
          });
          speechInProgress.current = true;
          Speech.speak("Sorry, I could not describe the image.", {
            onDone: () => {
              console.log("[MyVision] Error speech done");
              speechInProgress.current = false;
            },
            onError: (err) => {
              console.log("[MyVision] Error speech error:", err, {
                platform: Platform.OS,
              });
              speechInProgress.current = false;
            },
          });
          updateVisionState({ answer: "Failed to describe image." });
        }
      } finally {
        updateVisionState({ isLoading: false });
        abortControllerRef.current = null;
      }
    },
    [visionState.isLoading, cancelSpeech]
  );

  const handleTakePicture = useCallback(async () => {
    if (!cameraRef.current || visionState.isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    cancelSpeech();
    try {
      const photo = await cameraRef.current.takePictureAsync();
      updateVisionState({ uri: photo.uri, answer: "", isLoading: true });
      await getInfoFromAi(photo.uri);
    } catch (error) {
      console.log("[MyVision] Take picture error:", error, {
        platform: Platform.OS,
      });
      speechInProgress.current = true;
      Speech.speak("Failed to take a picture.", {
        onDone: () => {
          console.log("[MyVision] Take picture error speech done");
          speechInProgress.current = false;
        },
        onError: (err) => {
          console.log("[MyVision] Take picture error speech error:", err, {
            platform: Platform.OS,
          });
          speechInProgress.current = false;
        },
      });
      updateVisionState({ isLoading: false });
    }
  }, [cancelSpeech, visionState.isLoading, getInfoFromAi]);

  const handleRetake = useCallback(() => {
    if (visionState.isLoading) return;
    cancelSpeech();
    updateVisionState({ uri: null, answer: "", isLoading: false });
    speechInProgress.current = true;
    console.log("[MyVision] Speaking: Ready for a new picture");
    Speech.speak("Ready for a new picture.", {
      onDone: () => {
        console.log("[MyVision] Retake speech done");
        speechInProgress.current = false;
      },
      onError: (err) => {
        console.log("[MyVision] Retake speech error:", err, {
          platform: Platform.OS,
        });
        speechInProgress.current = false;
      },
    });
  }, [cancelSpeech, visionState.isLoading]);

  const handleRepeat = useCallback(() => {
    if (visionState.uri && visionState.answer && !visionState.isLoading) {
      cancelSpeech();
      speechInProgress.current = true;
      console.log("[MyVision] Speaking: Repeating description");
      Speech.speak("Repeating description.", {
        onDone: () => {
          console.log("[MyVision] Repeating description speech done");
          speechInProgress.current = true;
          Speech.speak(visionState.answer, {
            onDone: () => {
              console.log("[MyVision] Repeated description speech done");
              speechInProgress.current = false;
            },
            onError: (err) => {
              console.log(
                "[MyVision] Repeated description speech error:",
                err,
                { platform: Platform.OS }
              );
              speechInProgress.current = false;
            },
          });
        },
        onError: (err) => {
          console.log("[MyVision] Repeating description speech error:", err, {
            platform: Platform.OS,
          });
          speechInProgress.current = false;
        },
      });
    }
  }, [visionState, cancelSpeech]);

  const handleSwipe = (direction) => {
    console.log("[MyVision] Swiped", direction);
    if (visionState.isLoading) return;

    if (direction === "up") {
      console.log("[MyVision] Triggering takePicture or retake");
      if (visionState.uri) {
        handleRetake();
      } else {
        handleTakePicture();
      }
    } else if (direction === "down") {
      if (visionState.uri && visionState.answer) {
        handleRepeat();
      }
    }
  };

  const panGesture = Gesture.Pan()
    .minPointers(2)
    .minDistance(15)
    .onEnd((event) => {
      console.log("[MyVision] Pan gesture evaluated:", {
        translationY: event.translationY,
        translationX: event.translationX,
        velocityY: event.velocityY,
        velocityX: event.velocityX,
        pointers: event.numberOfPointers,
      });
      const verticalSwipe = event.translationY;
      const horizontalSwipe = event.translationX;

      if (
        Math.abs(verticalSwipe) > 50 &&
        Math.abs(verticalSwipe) > Math.abs(horizontalSwipe)
      ) {
        const direction = verticalSwipe < 0 ? "up" : "down";
        runOnJS(handleSwipe)(direction);
      } else {
        console.log("[MyVision] Pan gesture ignored");
      }
    });

  const renderContent = () => {
    if (visionState.isCameraActive && !visionState.uri) {
      return (
        <GestureHandlerRootView style={styles.flexFill}>
          <CameraView
            ref={cameraRef}
            style={styles.flexFill}
            onCameraReady={() => updateVisionState({ isCameraActive: true })}
          />
        </GestureHandlerRootView>
      );
    }
    if (visionState.uri) {
      return (
        <>
          <Image source={{ uri: visionState.uri }} style={styles.flexFill} />
          <ScrollView
            style={styles.answerContainer}
            contentContainerStyle={
              visionState.isLoading
                ? { flex: 1, justifyContent: "center", alignItems: "center" }
                : undefined
            }>
            {visionState.isLoading ? (
              <BallIndicator color='white' size={80} count={9} />
            ) : (
              <Text style={styles.answer}>{visionState.answer}</Text>
            )}
          </ScrollView>
        </>
      );
    }
    return null;
  };

  return (
    <ScreenWrapper>
      <GestureDetector gesture={panGesture}>
        <View style={styles.container}>
          {renderContent()}
          <View style={styles.buttonsContainer}>
            <PrimaryButton
              title={visionState.uri ? "Retake" : "Take Picture"}
              backgroundColor={Colors.MainColor}
              textColor='white'
              isLoading={visionState.isLoading}
              onPress={visionState.uri ? handleRetake : handleTakePicture}
              style={{ width: visionState.uri ? "49%" : "100%" }}
            />
            {visionState.uri && (
              <PrimaryButton
                title='Repeat'
                backgroundColor={Colors.green500}
                textColor={Colors.MainColor}
                isLoading={visionState.isLoading}
                onPress={handleRepeat}
                style={{ width: "49%" }}
              />
            )}
          </View>
        </View>
      </GestureDetector>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flexFill: { flex: 1 },
  answerContainer: {
    backgroundColor: "#41403DD6",
    position: "absolute",
    margin: 20,
    width: "90%",
    height: "88%",
    borderRadius: 22,
  },
  answer: {
    padding: 10,
    fontSize: 20,
    fontWeight: "300",
    color: Colors.white,
    lineHeight: 28,
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 0,
    marginVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default MyVision;