import React, { useRef, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { CameraView } from "expo-camera";
import { readAsStringAsync, EncodingType } from "expo-file-system";
import genai from "@google/generative-ai";
import PrimaryButton from "../../components/UI/PrimaryButton";
import Colors from "../../constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import { BallIndicator } from "react-native-indicators";
import { GOOGLE_API_KEY } from "@env";

const API_KEY = GOOGLE_API_KEY;
console.log(API_KEY);

const MyVision = () => {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const cameraRef = useRef();
  const [uri, setUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  useFocusEffect(() => {
    setIsCameraActive(true);

    return () => {
      setIsCameraActive(false);
    }
  });

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setUri(photo.uri);
      setAnswer(""); // Clear previous answer
      await getInfoFromAi(photo.uri);
    }
  }

  async function reTakePicture() {
    setUri(null);
    setAnswer("");
  }

  async function getInfoFromAi(imageUri) {
    setIsLoading(true);

    try {
      const base64Image = await readAsStringAsync(imageUri, {
        encoding: EncodingType.Base64,
      });

      const genAI = new genai.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
      const responseText = result.response.text();
      setAnswer(responseText);
      console.log(answer);
    } catch (error) {
      console.error("Error describing image:", error);
      setAnswer("Failed to describe image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {uri ? (
        <>
          <Image source={{ uri }} style={{ flex: 1 }} />
          <ScrollView style={styles.answerContainer}>
            {isLoading && (
              <BallIndicator
                color='white'
                size={80}
                count={9}
                style={{ top: "360%" }}
              />
            )}
            {!isLoading && <Text style={styles.answer}>{answer}</Text>}
          </ScrollView>
        </>
      ) : (
        isCameraActive && <CameraView style={{ flex: 1 }} ref={cameraRef} />
      )}

      <View style={styles.buttonsContainer}>
        <PrimaryButton
          title='Take A Picture'
          backgroundColor={Colors.MainColor}
          textColor='white'
          isLoading={false}
          onPress={uri ? reTakePicture : takePicture}
          style={{ width: uri ? "49%" : "100%" }}
        />

        {uri && (
          <PrimaryButton
            title='Repeat'
            backgroundColor={Colors.green500}
            textColor={Colors.MainColor}
            isLoading={false}
            onPress={() => getInfoFromAi(uri)}
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
