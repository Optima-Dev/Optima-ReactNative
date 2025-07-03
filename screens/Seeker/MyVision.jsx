import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
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

const MyVision = ({ navigation }) => {
  const [visionState, setVisionState] = useState({
    isCameraActive: true,
    uri: null,
    isLoading: false,
    answer: "",
  });

  const cameraRef = useRef();
  const hasSpokenIntro = useRef(false);

  const updateVisionState = (updates) =>
    setVisionState((prev) => ({ ...prev, ...updates }));

  const cancelSpeech = useCallback(() => {
    Speech.stop();
  }, []);

  useFocusEffect(
    useCallback(() => {
      updateVisionState({ isCameraActive: true });
      if (!hasSpokenIntro.current) {
        Speech.speak(
          "My Vision is active. Swipe up to take a picture. After that, swipe up to retake or swipe down to repeat the description."
        );
        hasSpokenIntro.current = true;
      }

      return () => {
        updateVisionState({ isCameraActive: false });
        cancelSpeech();
        hasSpokenIntro.current = false;
      };
    }, [])
  );

  const getInfoFromAi = useCallback(
    async (imageUri) => {
      if (!imageUri || visionState.isLoading) return;
      cancelSpeech();
      updateVisionState({ isLoading: true });
      Speech.speak("Analyzing image.");
      try {
        const base64Image = await readAsStringAsync(imageUri, {
          encoding: EncodingType.Base64,
        });
        const imagePart = {
          inlineData: { mimeType: "image/jpeg", data: base64Image },
        };
        const result = await model.generateContent([
          "Describe this image in detail for a visually impaired person.",
          imagePart,
        ]);
        const responseText = result.response.text();
        updateVisionState({ answer: responseText });
        Speech.speak(responseText);
      } catch (error) {
        Speech.speak("Sorry, I could not describe the image.");
        updateVisionState({ answer: "Failed to describe image." });
      } finally {
        updateVisionState({ isLoading: false });
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
      Speech.speak("Failed to take a picture.");
      updateVisionState({ isLoading: false });
    }
  }, [cancelSpeech, visionState.isLoading, getInfoFromAi]);

  const handleRetake = useCallback(() => {
    if (visionState.isLoading) return;
    cancelSpeech();
    updateVisionState({ uri: null, answer: "", isLoading: false });
    Speech.speak("Ready for a new picture.");
  }, [cancelSpeech, visionState.isLoading]);

  const handleRepeat = useCallback(() => {
    if (visionState.uri && visionState.answer && !visionState.isLoading) {
      cancelSpeech();
      Speech.speak("Repeating description.", {
        onDone: () => Speech.speak(visionState.answer),
      });
    }
  }, [visionState]);

  const handleSwipe = (direction) => {
  console.log("Swiped", direction);
  if (visionState.isLoading) return;

  if (direction === "up") {
    console.log("Triggering takePicture or retake");
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
    .onEnd((event) => {
      const verticalSwipe = event.translationY;
      const horizontalSwipe = event.translationX;

      if (
        Math.abs(verticalSwipe) > 50 &&
        Math.abs(verticalSwipe) > Math.abs(horizontalSwipe)
      ) {
        const direction = verticalSwipe < 0 ? "up" : "down";
        runOnJS(handleSwipe)(direction);
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
          <ScrollView style={styles.answerContainer} contentContainerStyle={visionState.isLoading ? { flex: 1, justifyContent: "center", alignItems: "center" } : undefined}>
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
