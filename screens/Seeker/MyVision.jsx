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
import { CameraView, useCameraPermissions } from "expo-camera";
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
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Suppress console errors
console.error = () => {};

const MyVision = ({ navigation }) => {
  const [visionState, setVisionState] = useState({
    isCameraActive: false,
    uri: null,
    isLoading: false,
    answer: "",
  });
  const [cameraKey, setCameraKey] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const isMounted = useRef(true);
  const hasSpokenIntro = useRef(false);
  const abortControllerRef = useRef(null);
  const speechInProgress = useRef(false);
  const firstMount = useRef(true);
  const retryCount = useRef(0);
  const cameraReadyTimeout = useRef(null);

  const updateVisionState = useCallback((updates) => {
    if (isMounted.current) {
      setVisionState((prev) => ({ ...prev, ...updates }));
    }
  }, []);

  // Clear speech queue with timeout
  const clearSpeechQueue = useCallback(async () => {
    if (await Speech.isSpeakingAsync()) {
      console.log("[MyVision] Speech active, stopping existing", {
        platform: Platform.OS,
      });
      await Speech.stop();
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("[MyVision] Speech queue cleared", { platform: Platform.OS });
    }
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

    speechInProgress.current = true;
    console.log("[MyVision] Intro message initiated", {
      platform: Platform.OS,
    });
    const introMessage =
      "My Vision is active. Swipe up to take a picture. After that, swipe up to retake or swipe down to repeat the description.";
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch((err) => {
      console.log("[MyVision] Haptics error:", err);
    });
    await clearSpeechQueue();
    Speech.speak(introMessage, {
      language: "en-US",
      rate: 0.85,
      pitch: 1.0,
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
        if (
          visionState.isCameraActive &&
          retryCount.current < 2 &&
          isMounted.current
        ) {
          retryCount.current += 1;
          console.log("[MyVision] Retrying intro message", {
            retryCount: retryCount.current,
          });
          setTimeout(() => speakIntroMessage(), 1000);
        }
      },
    });
  }, [visionState.isCameraActive, clearSpeechQueue]);

  // Handle camera permissions
  useEffect(() => {
    isMounted.current = true;
    const checkPermissions = async () => {
      if (!permission) {
        console.log("[MyVision] Requesting camera permission");
        const result = await requestPermission();
        if (result.granted) {
          console.log("[MyVision] Camera permission granted");
          updateVisionState({ isCameraActive: true });
        } else {
          console.log("[MyVision] Camera permission denied");
          speechInProgress.current = true;
          await clearSpeechQueue();
          Speech.speak("Camera permission is required to take pictures.", {
            language: "en-US",
            rate: 0.85,
            pitch: 1.0,
            onDone: () => {
              console.log("[MyVision] Permission denied speech done");
              speechInProgress.current = false;
            },
            onError: (err) => {
              console.log("[MyVision] Permission denied speech error:", err, {
                platform: Platform.OS,
              });
              speechInProgress.current = false;
            },
          });
          updateVisionState({ isCameraActive: false });
        }
      } else if (permission.granted) {
        updateVisionState({ isCameraActive: true });
      } else {
        updateVisionState({ isCameraActive: false });
      }
    };
    checkPermissions();

    return () => {
      isMounted.current = false;
      if (cameraReadyTimeout.current) {
        clearTimeout(cameraReadyTimeout.current);
        cameraReadyTimeout.current = null;
      }
    };
  }, [permission, requestPermission, clearSpeechQueue, updateVisionState]);

  useFocusEffect(
    useCallback(() => {
      console.log("[MyVision] Screen focused");
      // Re-check permissions on focus
      const initializeCamera = async () => {
        if (permission?.granted) {
          updateVisionState({ isCameraActive: true });
        } else {
          console.log("[MyVision] Re-requesting camera permission on focus");
          const result = await requestPermission();
          if (result.granted) {
            updateVisionState({ isCameraActive: true });
          } else {
            speechInProgress.current = true;
            await clearSpeechQueue();
            Speech.speak("Camera permission is required to take pictures.", {
              language: "en-US",
              rate: 0.85,
              pitch: 1.0,
              onDone: () => {
                console.log("[MyVision] Permission denied speech done");
                speechInProgress.current = false;
              },
              onError: (err) => {
                console.log("[MyVision] Permission denied speech error:", err, {
                  platform: Platform.OS,
                });
                speechInProgress.current = false;
              },
            });
            updateVisionState({ isCameraActive: false });
          }
        }
      };
      initializeCamera();
      if (!hasSpokenIntro.current && permission?.granted) {
        speakIntroMessage();
      }

      return () => {
        console.log("[MyVision] Screen losing focus, cleaning up");
        updateVisionState({
          isCameraActive: false,
          uri: null,
          isLoading: false,
          answer: "",
        });
        if (abortControllerRef.current) {
          console.log("[MyVision] Cancelling image analysis");
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
        clearSpeechQueue();
        speechInProgress.current = false;
        hasSpokenIntro.current = false;
        firstMount.current = true;
        retryCount.current = 0;
        cameraRef.current = null; // Clear camera reference
        if (cameraReadyTimeout.current) {
          clearTimeout(cameraReadyTimeout.current);
          cameraReadyTimeout.current = null;
        }
      };
    }, [
      clearSpeechQueue,
      speakIntroMessage,
      permission,
      requestPermission,
      updateVisionState,
    ])
  );

  const getInfoFromAi = useCallback(
    async (imageUri) => {
      if (!imageUri || visionState.isLoading) return;
      await clearSpeechQueue();
      updateVisionState({ isLoading: true });
      speechInProgress.current = true;
      console.log("[MyVision] Speaking: Analyzing image");
      Speech.speak("Analyzing image.", {
        language: "en-US",
        rate: 0.85,
        pitch: 1.0,
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
          language: "en-US",
          rate: 0.85,
          pitch: 1.0,
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
          await clearSpeechQueue();
          Speech.speak("Image analysis cancelled.", {
            language: "en-US",
            rate: 0.85,
            pitch: 1.0,
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
          await clearSpeechQueue();
          Speech.speak("Sorry, I could not describe the image.", {
            language: "en-US",
            rate: 0.85,
            pitch: 1.0,
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
    [visionState.isLoading, clearSpeechQueue, updateVisionState]
  );

  const handleTakePicture = useCallback(async () => {
    if (
      !cameraRef.current ||
      visionState.isLoading ||
      !visionState.isCameraActive
    ) {
      console.log("[MyVision] Take picture skipped:", {
        cameraRef: !!cameraRef.current,
        isLoading: visionState.isLoading,
        isCameraActive: visionState.isCameraActive,
      });
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch((err) => {
      console.log("[MyVision] Haptics error:", err);
    });
    await clearSpeechQueue();
    try {
      const photo = await cameraRef.current.takePictureAsync();
      updateVisionState({ uri: photo.uri, answer: "", isLoading: true });
      await getInfoFromAi(photo.uri);
    } catch (error) {
      console.log("[MyVision] Take picture error:", error, {
        platform: Platform.OS,
      });
      speechInProgress.current = true;
      await clearSpeechQueue();
      Speech.speak("Failed to take a picture.", {
        language: "en-US",
        rate: 0.85,
        pitch: 1.0,
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
  }, [
    visionState.isLoading,
    visionState.isCameraActive,
    clearSpeechQueue,
    getInfoFromAi,
    updateVisionState,
  ]);

  const handleRetake = useCallback(() => {
    if (visionState.isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch((err) => {
      console.log("[MyVision] Haptics error:", err);
    });
    setCameraKey((prev) => prev + 1); // Force camera remount
    cameraRef.current = null; // Clear camera reference
    updateVisionState({
      uri: null,
      answer: "",
      isLoading: false,
      isCameraActive: false,
    });
    setTimeout(() => {
      if (isMounted.current) {
        updateVisionState({ isCameraActive: permission?.granted });
      }
    }, 100); // Delay to ensure camera unmounts
    speechInProgress.current = true;
    console.log("[MyVision] Speaking: Ready for a new picture");
    clearSpeechQueue().then(() => {
      Speech.speak("Ready for a new picture.", {
        language: "en-US",
        rate: 0.85,
        pitch: 1.0,
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
    });
  }, [visionState.isLoading, clearSpeechQueue, permission, updateVisionState]);

  const handleRepeat = useCallback(() => {
    if (visionState.uri && visionState.answer && !visionState.isLoading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch((err) => {
        console.log("[MyVision] Haptics error:", err);
      });
      speechInProgress.current = true;
      console.log("[MyVision] Speaking: Repeating description");
      clearSpeechQueue().then(() => {
        Speech.speak("Repeating description.", {
          language: "en-US",
          rate: 0.85,
          pitch: 1.0,
          onDone: () => {
            console.log("[MyVision] Repeating description speech done");
            speechInProgress.current = true;
            Speech.speak(visionState.answer, {
              language: "en-US",
              rate: 0.85,
              pitch: 1.0,
              onDone: () => {
                console.log("[MyVision] Repeated description speech done");
                speechInProgress.current = false;
              },
              onError: (err) => {
                console.log(
                  "[MyVision] Repeated description speech error:",
                  err,
                  {
                    platform: Platform.OS,
                  }
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
      });
    }
  }, [visionState, clearSpeechQueue]);

  const handleSwipe = useCallback(
    (direction) => {
      console.log("[MyVision] Swiped", direction);
      if (visionState.isLoading) {
        console.log("[MyVision] Swipe ignored due to isLoading");
        return;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch((err) => {
        console.log("[MyVision] Haptics error:", err);
      });
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
    },
    [visionState, handleTakePicture, handleRetake, handleRepeat]
  );

  const panGesture = Gesture.Pan()
    .minPointers(2)
    .maxPointers(2)
    .minDistance(8)
    .activeOffsetY([-10, 10])
    .onStart((event) => {
      console.log("[MyVision] Gesture started", {
        pointers: event.numberOfPointers,
        minPointers: Platform.OS === "android" ? 1 : 2,
        maxPointers: 2,
        platform: Platform.OS,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch((err) => {
        console.log("[MyVision] Haptics error:", err);
      });
      if (Platform.OS === "android" && event.numberOfPointers === 1) {
        console.log("[MyVision] Android fallback: single-pointer swipe", {
          platform: Platform.OS,
        });
      }
    })
    .onEnd((event) => {
      console.log("[MyVision] Pan gesture evaluated:", {
        translationY: event.translationY,
        translationX: event.translationX,
        velocityY: event.velocityY,
        velocityX: event.velocityX,
        pointers: event.numberOfPointers,
      });
      const minPointers = Platform.OS === "android" ? 1 : 2;
      if (event.numberOfPointers < minPointers) {
        console.log(
          "[MyVision] Pointer validation failed: insufficient pointers",
          {
            pointers: event.numberOfPointers,
            minPointers,
          }
        );
        speechInProgress.current = true;
        clearSpeechQueue().then(() => {
          Speech.speak("Please use a two-finger swipe.", {
            language: "en-US",
            rate: 0.85,
            pitch: 1.0,
            onDone: () => {
              console.log("[MyVision] Invalid swipe speech done");
              speechInProgress.current = false;
            },
            onError: (err) => {
              console.log("[MyVision] Invalid swipe speech error:", err, {
                platform: Platform.OS,
              });
              speechInProgress.current = false;
            },
          });
        });
        return;
      }
      const verticalSwipe = event.translationY;
      const horizontalSwipe = event.translationX;
      if (
        Math.abs(verticalSwipe) > 20 &&
        Math.abs(verticalSwipe) > Math.abs(horizontalSwipe)
      ) {
        const direction = verticalSwipe < 0 ? "up" : "down";
        runOnJS(handleSwipe)(direction);
      } else {
        console.log("[MyVision] Pan gesture ignored");
        speechInProgress.current = true;
        clearSpeechQueue().then(() => {
          Speech.speak("Please swipe up or down.", {
            language: "en-US",
            rate: 0.85,
            pitch: 1.0,
            onDone: () => {
              console.log("[MyVision] Invalid swipe direction speech done");
              speechInProgress.current = false;
            },
            onError: (err) => {
              console.log(
                "[MyVision] Invalid swipe direction speech error:",
                err,
                {
                  platform: Platform.OS,
                }
              );
              speechInProgress.current = false;
            },
          });
        });
      }
    });

  const renderContent = () => {
    if (visionState.isCameraActive && !visionState.uri && permission?.granted) {
      return (
        <GestureDetector gesture={panGesture}>
          <GestureHandlerRootView style={styles.flexFill}>
            <CameraView
              key={cameraKey}
              ref={(ref) => (cameraRef.current = ref)}
              style={styles.flexFill}
              onCameraReady={() => {
                console.log("[MyVision] Camera ready");
                if (cameraReadyTimeout.current) {
                  clearTimeout(cameraReadyTimeout.current);
                  cameraReadyTimeout.current = null;
                }
                updateVisionState({ isCameraActive: true });
              }}
              onMountError={(error) => {
                console.log("[MyVision] Camera mount error:", error, {
                  platform: Platform.OS,
                });
                updateVisionState({ isCameraActive: false });
                speechInProgress.current = true;
                clearSpeechQueue().then(() => {
                  Speech.speak("Camera failed to initialize.", {
                    language: "en-US",
                    rate: 0.85,
                    pitch: 1.0,
                    onDone: () => {
                      console.log("[MyVision] Camera error speech done");
                      speechInProgress.current = false;
                    },
                    onError: (err) => {
                      console.log(
                        "[MyVision] Camera error speech error:",
                        err,
                        {
                          platform: Platform.OS,
                        }
                      );
                      speechInProgress.current = false;
                    },
                  });
                });
              }}
            />
          </GestureHandlerRootView>
        </GestureDetector>
      );
    }
    if (visionState.uri) {
      return (
        <GestureDetector gesture={panGesture}>
          <View style={styles.flexFill}>
            <Image source={{ uri: visionState.uri }} style={styles.flexFill} />
            <ScrollView
              style={styles.answerContainer}
              contentContainerStyle={
                visionState.isLoading
                  ? { flex: 1, justifyContent: "center", alignItems: "center" }
                  : undefined
              }
              scrollEnabled={true}
            >
              {visionState.isLoading ? (
                <BallIndicator color="white" size={80} count={9} />
              ) : (
                <Text style={styles.answer}>{visionState.answer}</Text>
              )}
            </ScrollView>
          </View>
        </GestureDetector>
      );
    }
    return (
      <View style={styles.flexFill}>
        <Text style={styles.errorText}>
          Camera permission is required to use this feature.
        </Text>
      </View>
    );
  };

  // Retry camera initialization if not ready
  useEffect(() => {
    if (
      visionState.isCameraActive &&
      permission?.granted &&
      !cameraRef.current
    ) {
      cameraReadyTimeout.current = setTimeout(() => {
        if (isMounted.current && !cameraRef.current) {
          console.log("[MyVision] Camera not ready, retrying");
          setCameraKey((prev) => prev + 1);
          speechInProgress.current = true;
          clearSpeechQueue().then(() => {
            Speech.speak("Camera is not ready, please try again.", {
              language: "en-US",
              rate: 0.85,
              pitch: 1.0,
              onDone: () => {
                console.log("[MyVision] Camera not ready speech done");
                speechInProgress.current = false;
              },
              onError: (err) => {
                console.log("[MyVision] Camera not ready speech error:", err, {
                  platform: Platform.OS,
                });
                speechInProgress.current = false;
              },
            });
          });
        }
      }, 2000);
    }
    return () => {
      if (cameraReadyTimeout.current) {
        clearTimeout(cameraReadyTimeout.current);
        cameraReadyTimeout.current = null;
      }
    };
  }, [visionState.isCameraActive, permission, clearSpeechQueue]);

  // Delay gesture initialization to ensure GestureHandlerRootView is ready
  useEffect(() => {
    const gestureDelay = setTimeout(() => {
      console.log("[MyVision] Gesture handler initialized");
    }, 100);
    return () => clearTimeout(gestureDelay);
  }, []);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {renderContent()}
        <View style={styles.buttonsContainer}>
          <PrimaryButton
            title={visionState.uri ? "Retake" : "Take Picture"}
            backgroundColor={Colors.MainColor}
            textColor="white"
            isLoading={visionState.isLoading}
            onPress={visionState.uri ? handleRetake : handleTakePicture}
            disabled={!visionState.isCameraActive || !permission?.granted}
            style={{ width: visionState.uri ? "49%" : "100%" }}
          />
          {visionState.uri && (
            <PrimaryButton
              title="Repeat"
              backgroundColor={Colors.green500}
              textColor={Colors.MainColor}
              isLoading={visionState.isLoading}
              onPress={handleRepeat}
              style={{ width: "49%" }}
            />
          )}
        </View>
      </View>
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
  errorText: {
    fontSize: 16,
    color: Colors.red,
    textAlign: "center",
    padding: 20,
  },
});

export default MyVision;