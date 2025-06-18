import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { CameraView } from "expo-camera";
import { BallIndicator } from "react-native-indicators";
import { readAsStringAsync, EncodingType } from "expo-file-system";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PrimaryButton from "../../components/UI/PrimaryButton";
import Colors from "../../constants/Colors";
import { GOOGLE_API_KEY } from "@env";
import * as Speech from "expo-speech";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const MyVision = () => {
  const [visionState, setVisionState] = useState({
    isCameraActive: true,
    uri: null,
    isLoading: false,
    answer: "",
  });

  const cameraRef = useRef();
  const isCancelledSpeechRef = useRef(false);
  const isCancelledLoadingSpeechRef = useRef(false);
  const navigation = useNavigation();

  // Helper function to update vision state
  const updateVisionState = (updates) =>
    setVisionState((prev) => ({ ...prev, ...updates }));

  // Cancel speech synthesis
  const cancelSpeech = useCallback(() => {
    Speech.stop();
    isCancelledSpeechRef.current = true;
    isCancelledLoadingSpeechRef.current = true;
  }, []);

  // Speak loading message
  const speakLoadingMessage = useCallback(() => {
    isCancelledLoadingSpeechRef.current = false;
    Speech.speak("Please wait while the description is being generated.");
  }, []);

  // Handle navigation blur to stop speech
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", cancelSpeech);
    return unsubscribe;
  }, [navigation, cancelSpeech]);

  // Manage camera activation on focus
  useFocusEffect(
    useCallback(() => {
      updateVisionState({ isCameraActive: true });
      return () => updateVisionState({ isCameraActive: false });
    }, [])
  );

  // Handle taking a picture
  const handleTakePicture = useCallback(async () => {
    if (!cameraRef.current) {
      Speech.speak("Camera is not ready. Please try again.");
      return;
    }

    cancelSpeech();

    try {
      const photo = await cameraRef.current.takePictureAsync();
      updateVisionState({ uri: photo.uri, answer: "", isLoading: true });
      await getInfoFromAi(photo.uri);
    } catch (error) {
      Speech.speak("Failed to take a picture. Please try again.");
    }
  }, [cancelSpeech]);

  // Handle retaking a picture
  const handleRetake = useCallback(() => {
    cancelSpeech();
    updateVisionState({ uri: null, answer: "", isLoading: false });
  }, [cancelSpeech]);

  // Fetch image description from AI
  const getInfoFromAi = useCallback(
    async (imageUri) => {
      Speech.stop();
      updateVisionState({ isLoading: true });
      isCancelledSpeechRef.current = false;
      speakLoadingMessage();

      try {
        const base64Image = await readAsStringAsync(imageUri, {
          encoding: EncodingType.Base64,
        });

        const imagePart = {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        };

        const result = await model.generateContent([
          "Describe this image in detail.",
          imagePart,
        ]);

        if (
          isCancelledSpeechRef.current ||
          isCancelledLoadingSpeechRef.current
        ) {
          return;
        }

        const responseText = result.response.text();
        updateVisionState({ answer: responseText });

        if (!isCancelledSpeechRef.current) {
          Speech.speak(responseText);
        }
      } catch (error) {
        Speech.speak("Failed to describe the image. Please try again.");
        updateVisionState({
          answer: "Failed to describe image. Please try again.",
        });
      } finally {
        updateVisionState({ isLoading: false });
      }
    },
    [speakLoadingMessage]
  );

  // Memoized content rendering
  const renderContent = useMemo(() => {
    if (!visionState.uri && visionState.isCameraActive) {
      return <CameraView style={styles.flexFill} ref={cameraRef} />;
    }

    return (
      <>
        <Image source={{ uri: visionState.uri }} style={styles.flexFill} />
        <ScrollView style={styles.answerContainer}>
          {visionState.isLoading ? (
            <BallIndicator
              color='white'
              size={80}
              count={9}
              style={styles.loader}
            />
          ) : (
            <Text style={styles.answer}>{visionState.answer}</Text>
          )}
        </ScrollView>
      </>
    );
  }, [
    visionState.uri,
    visionState.isCameraActive,
    visionState.isLoading,
    visionState.answer,
  ]);

  return (
    <View style={styles.container}>
      {renderContent}

      <View style={styles.buttonsContainer}>
        <PrimaryButton
          title={visionState.uri ? "Retake A Picture" : "Take A Picture"}
          backgroundColor={Colors.MainColor}
          textColor='white'
          isLoading={false}
          onPress={visionState.uri ? handleRetake : handleTakePicture}
          style={{ width: visionState.uri ? "49%" : "100%" }}
        />

        {visionState.uri && (
          <PrimaryButton
            title='Repeat'
            backgroundColor={Colors.green500}
            textColor={Colors.MainColor}
            isLoading={false}
            onPress={() => getInfoFromAi(visionState.uri)}
            style={{ width: "49%" }}
          />
        )}
      </View>
    </View>
  );
};

export default MyVision;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexFill: {
    flex: 1,
  },
  loader: {
    top: "360%",
  },
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
  },
});
