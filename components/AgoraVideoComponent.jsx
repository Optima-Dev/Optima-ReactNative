import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  RtcEngine,
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from "react-native-agora";

const APP_ID = "78d38f0beb8d47738eba2baaf3ccbd62"; // Replace with your Agora App ID

const AgoraVideoComponent = forwardRef(
  ({ token, roomName, onEndCall, shouldConnect }, ref) => {
    const engineRef = useRef(null);
    const [joined, setJoined] = useState(false);
    const [peerIds, setPeerIds] = useState([]);

    useEffect(() => {
      const init = async () => {
        try {
          engineRef.current = await RtcEngine.create(APP_ID);
          await engineRef.current.enableVideo();

          engineRef.current.addListener("UserJoined", (uid) => {
            setPeerIds((prev) => [...prev, uid]);
          });

          engineRef.current.addListener("UserOffline", (uid) => {
            setPeerIds((prev) => prev.filter((id) => id !== uid));
          });

          engineRef.current.addListener("JoinChannelSuccess", () => {
            setJoined(true);
          });

          if (shouldConnect && token && roomName) {
            console.log("🔌 Attempting to join Agora from init...");
            await engineRef.current?.joinChannel(token, roomName, null, 0);
            console.log("✅ Joined Agora Channel from init!");
          }
        } catch (err) {
          console.error("Agora init or join error:", err);
        }
      };

      init();

      return () => {
        if (engineRef.current) {
          engineRef.current.leaveChannel();
          engineRef.current.destroy();
        }
      };
    }, [token, roomName, shouldConnect]);

    useImperativeHandle(ref, () => ({
      disconnect: async () => {
        await engineRef.current?.leaveChannel();
        if (onEndCall) onEndCall();
      },
      flipCamera: async () => {
        await engineRef.current?.switchCamera();
      },
      getStatus: () => (joined ? "connected" : "disconnected"),
      getParticipantCount: () => peerIds.length + (joined ? 1 : 0),
    }));

    return (
      <View style={styles.container}>
        {joined ? (
          <>
            <RtcLocalView.SurfaceView
              style={styles.localVideo}
              channelId={roomName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay
            />
            {peerIds.map((uid) => (
              <RtcRemoteView.SurfaceView
                key={uid}
                style={styles.remoteVideo}
                uid={uid}
                channelId={roomName}
                renderMode={VideoRenderMode.Hidden}
              />
            ))}
          </>
        ) : (
          <View style={styles.overlay}>
            <Text style={styles.statusText}>Connecting...</Text>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  statusText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  localVideo: {
    width: 120,
    height: 160,
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 2,
  },
  remoteVideo: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default AgoraVideoComponent;
