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
import TwilioVideoComponent from "../../components/TwilioVideoComponent";

const CallVolunteer = ({ navigation }) => {
  const [videoInfo, setVideoInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token } = useAuth();
  const twilioComponentRef = useRef(null);

  useEffect(() => {
    if (isConnected) {
      const timeout = setTimeout(() => {
        if (twilioComponentRef.current) {
          console.log("✅ Twilio ref is ready!");
        } else {
          console.log("❌ Twilio ref is still NOT ready!");
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isConnected]);

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
    async function setupCall() {
      try {
        setIsLoading(true);
        const response = await createMeeting(token, { type: "global" });
        setVideoInfo(response.data);
        setIsConnected(true);
      } catch (error) {
        setIsError(error?.message || "Failed to create meeting");
        setTimeout(() => navigation.goBack(), 2000);
      } finally {
        setIsLoading(false);
      }
    }
    setupCall();
  }, []);

  async function handleEndingCall() {
    try {
      setIsLoading(true);
      if (twilioComponentRef.current) {
        twilioComponentRef.current.disconnect();
      }
      await endMeeting(token, videoInfo?.roomName);
      setIsConnected(false);
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      setIsConnected(false);
      setIsError(error?.message || "Failed to end meeting. Please try again.");
      setTimeout(() => navigation.goBack(), 2000);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFlipCamera() {
    if (twilioComponentRef.current) {
      twilioComponentRef.current.flipCamera();
    } else {
      console.log("No ref to Twilio component");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {isConnected ? (
          <View style={{ flex: 1 }}>
            <Text>Calling...</Text>
            <TwilioVideoComponent
              ref={twilioComponentRef}
              token={videoInfo?.token}
              roomName={videoInfo?.roomName}
              onEndCall={() => setIsConnected(false)}
            />
          </View>
        ) : (
          <>
            <ImageBackground
              source={require("../../assets/Images/volunteer.jpeg")}
              style={styles.personImage}
              blurRadius={12}
            />
            <Text style={styles.waiting}>
              {isLoading && videoInfo?.token
                ? "Ending Call..."
                : isLoading
                ? "Creating Call..."
                : isError}
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
          disabled={!isConnected}
        />
        <PrimaryButton
          backgroundColor={Colors.red600}
          textColor='white'
          title='End Call'
          style={styles.button}
          onPress={handleEndingCall}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
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
  twilioVideo: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  statusOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  statusText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
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
