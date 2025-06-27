import { useLayoutEffect, useState, useEffect, useRef } from "react";
import React from "react";
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
import { endMeeting, acceptFirstMeeting } from "../../util/MeetingHttp";
import TwilioVideoComponent from "../../components/TwilioVideoComponent";

const CallVolunteer = ({ navigation }) => {

  const [videoInfo, setVideoInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const { token } = useAuth();

  const twilioComponentRef = useRef(null);

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
        const response = await acceptFirstMeeting(token);
        
        console.log("Joining Meeting response:", response.data);
        setVideoInfo(response.data);
        setIsConnected(true);
      } catch (error) {
        setIsError(error || "Failed to join meeting");
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
      const data = await endMeeting(token, videoInfo.roomName);
      
      console.log("Ending call response:", data);
      setIsConnected(false);
      
      setTimeout(() => navigation.goBack(), 2000);
    } catch (error) {
      setIsConnected(false);
      setIsError(error || "Failed to end meeting");
      setTimeout(() => navigation.goBack(), 2000);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {isConnected ? (
          <>
            <View style={styles.statusOverlay}>
              <Text style={styles.statusText}> Video call should appear now </Text>
              {/* <TwilioVideoComponent
                ref={twilioComponentRef}
                token={videoInfo.token}
                roomName={videoInfo.roomName}
                identity={videoInfo.identity}
              /> */}
            </View>
          </>
        ) : (
          <>
            <ImageBackground
              source={require("../../assets/Images/volunteer.jpeg")}
              style={styles.personImage}
              blurRadius={12}
            />
            <Text style={styles.waiting}>
              { isLoading && videoInfo?.token ? "Ending Call..." : isLoading ? "Joining Call..." : isError }
            </Text>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
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
