import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { TwilioVideo } from "react-native-twilio-video-webrtc";

// This is a single, self-contained functional component that handles the Twilio video logic.
// It uses `forwardRef` to expose methods like `flipCamera` and `disconnect`.
const TwilioVideoComponent = forwardRef((props, ref) => {
  const {
    token,
    roomName,
    identity,
    onRoomDidConnect,
    onRoomDidDisconnect,
    onRoomDidFailToConnect,
    onParticipantAddedVideoTrack,
    onParticipantRemovedVideoTrack,
    style, // Pass style from parent
  } = props;

  // Use useRef for the TwilioVideo component. This is the standard approach in functional components.
  const twilioRef = useRef(null);

  // Expose the internal methods to the parent component via the ref.
  useImperativeHandle(ref, () => ({
    flipCamera: () => {
      if (twilioRef.current) {
        twilioRef.current.flipCamera();
      }
    },
    disconnect: () => {
      if (twilioRef.current) {
        twilioRef.current.disconnect();
      }
    },
  }));

  // This effect handles the connection logic.
  // It runs when the token or roomName changes.
  useEffect(() => {
    if (token && roomName && twilioRef.current) {
      const options = {
        accessToken: token,
        roomName: roomName,
      };
      if (identity) {
        options.identity = identity;
      }
      // Connect to the room.
      twilioRef.current.connect(options);
    }

    // This is the cleanup function that runs when the component unmounts.
    return () => {
      if (twilioRef.current) {
        twilioRef.current.disconnect();
      }
    };
  }, [token, roomName, identity]); // Dependencies for the effect

  // If we don't have a token or room name, don't render the video component.
  if (!token || !roomName) {
    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>Missing token or room name</Text>
      </View>
    );
  }

  // Render the actual TwilioVideo component.
  return (
    <TwilioVideo
      ref={twilioRef}
      style={style}
      onRoomDidConnect={onRoomDidConnect}
      onRoomDidDisconnect={onRoomDidDisconnect}
      onRoomDidFailToConnect={onRoomDidFailToConnect}
      onParticipantAddedVideoTrack={onParticipantAddedVideoTrack}
      onParticipantRemovedVideoTrack={onParticipantRemovedVideoTrack}
    />
  );
});

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default TwilioVideoComponent;
