import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import { View, Text, StyleSheet } from "react-native";
import { TwilioVideo } from "react-native-twilio-video-webrtc";

const TwilioVideoComponent = forwardRef(
  ({ token, roomName, onEndCall }, ref) => {
    const twilioRef = useRef();
    const [status, setStatus] = useState("disconnected"); // connected, disconnected, connecting
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);

    useImperativeHandle(ref, () => ({
      flipCamera: () => {
        if (twilioRef.current) {
          twilioRef.current.flipCamera();
        }
      },
      connect: () => {
        if (twilioRef.current && token && roomName) {
          setStatus("connecting");
          twilioRef.current.connect({ accessToken: token, roomName });
        }
      },
      disconnect: () => {
        if (twilioRef.current) {
          twilioRef.current.disconnect();
        }
      },
      toggleAudio: () => {
        if (twilioRef.current) {
          twilioRef.current
            .setLocalAudioEnabled(!isAudioEnabled)
            .then((isEnabled) => setIsAudioEnabled(isEnabled));
        }
      },
      toggleVideo: () => {
        if (twilioRef.current) {
          twilioRef.current
            .setLocalVideoEnabled(!isVideoEnabled)
            .then((isEnabled) => setIsVideoEnabled(isEnabled));
        }
      },
    }));

    useEffect(() => {
      if (token && roomName) {
        twilioRef.current?.connect({ accessToken: token, roomName });
        setStatus("connecting");
      }
    }, [token, roomName]);

    const _onRoomDidConnect = () => {
      setStatus("connected");
    };

    const _onRoomDidDisconnect = ({ error }) => {
      setStatus("disconnected");
      if (onEndCall) onEndCall();
    };

    const _onRoomDidFailToConnect = (error) => {
      setStatus("disconnected");
      if (onEndCall) onEndCall();
    };

    return (
      <View style={styles.container}>
        {status === "connected" ? (
          <>
            <TwilioVideo
              ref={twilioRef}
              onRoomDidConnect={_onRoomDidConnect}
              onRoomDidDisconnect={_onRoomDidDisconnect}
              onRoomDidFailToConnect={_onRoomDidFailToConnect}
              style={styles.video}
            />
            <Text style={styles.statusText}>Connected</Text>
          </>
        ) : status === "connecting" ? (
          <Text style={styles.statusText}>Connecting...</Text>
        ) : (
          <Text style={styles.statusText}>Disconnected</Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  statusText: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    color: "white",
    fontWeight: "bold",
  },
});

export default TwilioVideoComponent;
