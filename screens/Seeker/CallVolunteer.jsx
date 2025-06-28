import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
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
import { endMeeting, createMeeting } from "../../util/MeetingHttp";
import AgoraVideoComponent from "../../components/AgoraVideoComponent";

const CallVolunteer = ({ navigation }) => {
  const [videoInfo, setVideoInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const startCall = async () => {
      try {
        const response = await createMeeting(token, { type: "global" });
        setVideoInfo(response.data);
        console.log("📞 Meeting response:", response.data);
      } catch (err) {
        console.error("❌ Create meeting error:", err);
        setError("Failed to create call");
        setTimeout(() => navigation.goBack(), 2000);
      } finally {
        setIsLoading(false);
      }
    };
    startCall();
  }, [token, navigation]);

  const handleEndCall = async () => {
    try {
      setIsLoading(true);
      if (agoraRef.current) {
        await agoraRef.current.disconnect();
      }
      if (videoInfo?.roomName) {
        await endMeeting(token, videoInfo.roomName);
      }
    } catch (err) {
      setError("Failed to end call.");
    } finally {
      setTimeout(() => navigation.goBack(), 1500);
    }
  };

  const handleFlipCamera = () => {
    agoraRef.current?.flipCamera();
  };

  console.log("videoInfo", videoInfo);

  console.log("token", videoInfo?.token);

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {videoInfo?.token && videoInfo?.roomName ? (
          <AgoraVideoComponent
            ref={agoraRef}
            token={videoInfo.token}
            roomName={videoInfo.roomName}
            onEndCall={handleEndCall}
            shouldConnect={true}
          />
        ) : (
          <>
            <ImageBackground
              source={require("../../assets/Images/volunteer.jpeg")}
              style={styles.personImage}
              blurRadius={12}
            />
            <Text style={styles.waiting}>
              {isLoading ? "Creating Call..." : error ?? "Disconnected"}
            </Text>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          backgroundColor={Colors.MainColor}
          textColor='white'
          title='Flip Camera'
          style={styles.button}
          onPress={handleFlipCamera}
          disabled={!videoInfo}
        />
        <PrimaryButton
          backgroundColor={Colors.red600}
          textColor='white'
          title='End Call'
          style={styles.button}
          onPress={handleEndCall}
        />
      </View>
    </View>
  );
};

export default CallVolunteer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  personImage: {
    flex: 1,
    width: "100%",
  },
  waiting: {
    fontSize: 40,
    fontWeight: "700",
    color: Colors.white,
    position: "absolute",
    textAlign: "center",
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});
