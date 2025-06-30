import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import PrimaryButton from "../../components/UI/PrimaryButton";
import Colors from "../../constants/Colors";
import { useAuth } from "../../store/AuthContext";
import { endMeeting, createMeeting } from "../../util/MeetingHttp";
import AgoraVideoComponent from "../../components/AgoraVideoComponent";

// IMPORTANT: Import your configured socket client from where it's initialized in your app
// import { socket } from '../../socket'; // This is an example, use your actual import

const CallVolunteer = ({ navigation, route }) => {
  // --- STATE MANAGEMENT ---
  // A single, unified state for all call information.
  // It's initialized from the navigation parameters if they exist.
  const [callData, setCallData] = useState(route.params?.meetingData || null);

  const [isWaiting, setIsWaiting] = useState(route.params?.isWaiting || false);
  const [helperName] = useState(route.params?.helperName || "Volunteer");
  const [isLoading, setIsLoading] = useState(!callData); // Only loading if it's a new global call
  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState(null);

  const { token, user } = useAuth(); // Get user for potential socket authentication
  const agoraRef = useRef(null);

  // --- HIDE TAB BAR (UNCHANGED) ---
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

  // --- REAL-TIME LISTENER FOR SPECIFIC CALLS ---
  useEffect(() => {
    // This effect only runs if we are in the "waiting for a specific friend" state
    if (isWaiting && callData?._id) {
      console.log(`Seeker is now waiting for meeting ${callData._id} to be accepted.`);

      // This function will be called by the socket event
      const handleCallAccepted = (acceptedMeetingData) => {
        // Ensure the accepted call from the server matches the one we are waiting for
        if (acceptedMeetingData._id === callData._id) {
          console.log("✅ Helper accepted the call! Joining now.", acceptedMeetingData);
          setCallData(acceptedMeetingData); // Update state with the FINAL call info
          setIsWaiting(false); // This triggers the UI to switch to the video call
        }
      };
      
      // ===================================================================
      //  YOUR ACTION: Implement your socket listener here.
      //  The event name 'callAccepted' must match what your backend emits.
      // ===================================================================
      // Example: socket.on('callAccepted', handleCallAccepted);

      // It's also good practice to tell the server you're listening
      // Example: socket.emit('seeker_is_waiting', { meetingId: callData._id });

      // The cleanup function is crucial to prevent memory leaks
      return () => {
        console.log("Cleaning up listener for meeting:", callData._id);
        // Example: socket.off('callAccepted', handleCallAccepted);
      };
    }
  }, [isWaiting, callData]);


  // --- LOGIC TO CREATE A NEW GLOBAL CALL ---
  useEffect(() => {
    // This effect only runs for global calls (when no callData is passed via navigation)
    if (!callData && !isWaiting) {
      const startGlobalCall = async () => {
        setIsLoading(true);
        try {
          console.log("📞 Creating a new global call...");
          const response = await createMeeting(token, { type: "global" });
          setCallData(response.data);
        } catch (err) {
          console.error("❌ Create meeting error:", err);
          setError("Failed to create call.");
          setTimeout(() => navigation.goBack(), 2000);
        } finally {
          setIsLoading(false);
        }
      };
      startGlobalCall();
    }
  }, [callData, isWaiting, token]);


  // --- CALL CONTROL FUNCTIONS ---
  const handleEndCall = async () => {
    if (isEnding) return;
    setIsEnding(true);
    try {
      await agoraRef.current?.disconnect();
      // Use roomName or channelName, whichever your unified callData object provides
      const channel = callData?.roomName || callData?.channelName;
      if (channel) {
        await endMeeting(token, channel);
      }
    } catch (err) {
      console.error("❌ End call error:", err);
      setError("Failed to end call.");
    } finally {
      setTimeout(() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          // Navigate to a screen that exists in the Seeker's stack
          navigation.navigate("Support"); 
        }
      }, 1000);
    }
  };

  const handleFlipCamera = () => {
    agoraRef.current?.flipCamera();
  };

  // --- RENDER LOGIC ---

  if (isWaiting) {
    return (
      <View style={styles.waitingContainer}>
        <ActivityIndicator size='large' color={Colors.white} />
        <Text style={styles.waitingText}>
          Waiting for {helperName} to accept your call...
        </Text>
        <PrimaryButton
          backgroundColor={Colors.red600}
          textColor='white'
          title='Cancel Call'
          onPress={handleEndCall}
          style={{ width: '80%'}}
        />
      </View>
    );
  }

  // Check for all required data points before attempting to render the call
  const channel = callData?.roomName || callData?.channelName;
  if (isLoading || !callData?.token || !channel || !callData?.appId || !callData?.uid || error) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.waiting}>
          {isLoading
            ? "Connecting..."
            : error || "Meeting information is incomplete."}
        </Text>
        {error && !isLoading && (
          <PrimaryButton
            title='Go Back'
            onPress={() => navigation.goBack()}
            style={{ marginTop: 20 }}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AgoraVideoComponent
        ref={agoraRef}
        token={callData.token}
        channelName={channel}
        appId={callData.appId}
        uid={Number(callData.uid)}
        onEndCall={handleEndCall}
        shouldConnect={!isEnding}
        userRole="seeker"
      />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1C1C1E"
  },
  waiting: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
    textAlign: "center",
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
  waitingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C1C1E", // Darker background
    padding: 20,
  },
  waitingText: {
    color: Colors.white,
    fontSize: 18,
    marginVertical: 20,
    textAlign: "center",
  },
});

export default CallVolunteer;