// File: src/screens/CallScreen.js

import React, { useLayoutEffect, useState, useRef } from "react";
import { Platform, StyleSheet, Text, View, SafeAreaView } from "react-native";
import PrimaryButton from "../../components/UI/PrimaryButton";
import Colors from "../../constants/Colors";
import { useAuth } from "../../store/AuthContext";
import { endMeeting } from "../../util/MeetingHttp";
import AgoraVideoComponent from "../../components/AgoraVideoComponent";

const CallScreen = ({ navigation, route }) => {
  const { videoInfo, seekerName } = route.params || {};

  console.log("Received videoInfo:", videoInfo); // Good for debugging

  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState(null);
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

  const handleEndCall = async () => {
    if (isEnding) return;
    setIsEnding(true);
    try {
      await agoraRef.current?.disconnect();

      if (videoInfo?.channelName) {
        await endMeeting(token, videoInfo.channelName);
      }
    } catch (err) {
      console.error("❌ End call error:", err);
      setError("Failed to end call.");
    } finally {
      setTimeout(() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate("Home");
        }
      }, 1000);
    }
  };

  const handleFlipCamera = () => {
    agoraRef.current?.flipCamera();
  };

  if (
    !videoInfo?.token ||
    !videoInfo?.channelName ||
    !videoInfo?.appId ||
    !videoInfo?.uid
  ) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContainer}>
          <Text style={styles.waiting}>
            {error ||
              "Meeting information is incomplete. Missing token, roomName, appId, or uid."}
          </Text>
          <PrimaryButton
            backgroundColor={Colors.MainColor}
            textColor='white'
            title='Go Back'
            onPress={() => navigation.goBack()}
            style={{ marginTop: 20, width: "80%" }}
          />
        </View>
      </View>
    );
  }

  // This is the main UI when everything works correctly
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Call with {seekerName || "Seeker"}
        </Text>
      </View>

      <View style={styles.videoContainer}>
        <AgoraVideoComponent
          ref={agoraRef}
          token={videoInfo.token}
          channelName={videoInfo.channelName} // Use channelName for channelName
          appId={videoInfo.appId} // This MUST come from your backend
          uid={Number(videoInfo.uid)} // This MUST come from your backend
          onEndCall={handleEndCall}
          shouldConnect={!isEnding}
          remoteUserName={seekerName}
        />
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          backgroundColor={Colors.MainColor}
          textColor='white'
          title='Flip Camera'
          style={styles.button}
          onPress={handleFlipCamera}
          disabled={isEnding}
        />
        <PrimaryButton
          backgroundColor={Colors.red600}
          textColor='white'
          title={isEnding ? "Ending..." : "End Call"}
          style={styles.button}
          onPress={handleEndCall}
          disabled={isEnding}
        />
      </View>
    </SafeAreaView>
  );
};

export default CallScreen;

// Styles remain the same
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
  },
  headerText: { color: "white", fontSize: 16, fontWeight: "500" },
  videoContainer: { flex: 1 },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1C1C1E",
  },
  waiting: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
    textAlign: "center",
    marginBottom: 20,
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
  button: { flex: 1, marginHorizontal: 10 },
});
