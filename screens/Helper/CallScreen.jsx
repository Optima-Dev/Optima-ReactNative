import React, { useLayoutEffect, useState, useRef } from "react";
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PrimaryButton from "../../components/UI/PrimaryButton";
import Colors from "../../constants/Colors";
import { useAuth } from "../../store/AuthContext";
import { endMeeting } from "../../util/MeetingHttp";
import AgoraVideoComponent from "../../components/AgoraVideoComponent";

// The component now receives `route` as a prop to get navigation params
const CallScreen = ({ navigation, route }) => {
  // 1. Get videoInfo from route params instead of fetching it here
  // We provide a default empty object to prevent crashes if params are undefined
  const { videoInfo } = route.params || {};

  const [isEnding, setIsEnding] = useState(false);
  const { token } = useAuth();
  const agoraRef = useRef(null);

  useLayoutEffect(() => {
    const parentNav = navigation.getParent();
    parentNav?.setOptions({ tabBarStyle: { display: "none" } });

    return () => {
      parentNav?.setOptions({
        tabBarStyle: {
          display: "flex",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          marginBottom: Platform.OS === "ios" ? 0 : 12,
        },
      });
    };
  }, [navigation]);

  // The useEffect for fetching data is no longer needed.

  const handleEndCall = async () => {
    try {
      setIsEnding(true);
      await agoraRef.current?.disconnect();
      // FIX: Use channelName to match the API response
      if (videoInfo?.channelName) {
        await endMeeting(token, videoInfo.channelName);
      }
    } catch (err) {
      console.error("End call error:", err);
      setError("Failed to end call.");
    } finally {
      setTimeout(() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          // Fallback navigation if goBack is not possible
          navigation.navigate("Home");
        }
      }, 1500);
    }
  };

  const handleFlipCamera = () => {
    agoraRef.current?.flipCamera();
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {/* The component now renders immediately with the data it received */}
        {videoInfo?.token && videoInfo?.channelName ? (
          <AgoraVideoComponent
            ref={agoraRef}
            token={videoInfo.token}
            channelName={videoInfo.channelName}
            appId={videoInfo.appId}
            // CRITICAL: Ensure the uid is passed as a number
            uid={videoInfo.uid}
            onEndCall={handleEndCall}
            shouldConnect={true}
          />
        ) : (
          // This part now serves as a fallback in case data is not passed correctly
          <View style={styles.fallbackContainer}>
            <Text style={styles.waiting}>
              Error: No meeting information found.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          backgroundColor={Colors.MainColor}
          textColor='white'
          title='Flip Camera'
          style={styles.button}
          onPress={handleFlipCamera}
          disabled={!videoInfo || isEnding}
        />
        <PrimaryButton
          backgroundColor={Colors.red600}
          textColor='white'
          title='End Call'
          style={styles.button}
          onPress={handleEndingCall}
          disabled={isEnding || !videoInfo}
        />
      </View>
    </View>
  );
};

export default CallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  fallbackContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  waiting: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
    textAlign: "center",
    padding: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});
