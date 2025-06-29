import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from "react-native";
import {
  createAgoraRtcEngine,
  RtcSurfaceView,
  ChannelProfileType,
  ClientRoleType,
} from "react-native-agora";

const APP_ID = "78d38f0beb8d47738eba2baaf3ccbd62";

const requestAndroidPermissions = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      return (
        granted["android.permission.CAMERA"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.RECORD_AUDIO"] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn("Permission error:", err);
      return false;
    }
  }
  return true;
};

const AgoraVideoComponent = forwardRef(
  ({ token, roomName, onEndCall, shouldConnect }, ref) => {
    const engineRef = useRef(null);
    const [joined, setJoined] = useState(false);
    const [remoteUid, setRemoteUid] = useState(null);
    const [isReady, setIsReady] = useState(false); // State to control when preview renders

    // Effect for initializing and destroying the Agora engine (runs only once)
    useEffect(() => {
      const initEngine = async () => {
        const hasPermission = await requestAndroidPermissions();
        if (!hasPermission) {
          console.warn("Permissions not granted. Cannot start camera.");
          return;
        }

        try {
          console.log("Initializing Agora engine...");
          const engine = createAgoraRtcEngine();
          engineRef.current = engine;

          // FIX: The order of operations is corrected here.
          // 1. Initialize First
          engine.initialize({
            appId: APP_ID,
            channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
          });
          console.log("Agora engine initialized.");

          // 2. Register Event Handlers Second
          engine.registerEventHandler({
            onJoinChannelSuccess: (connection, _elapsed) => {
              console.log(
                "✅ Joined channel successfully:",
                connection.channelId
              );
              setJoined(true);
            },
            onUserJoined: (_connection, uid) => {
              console.log("📡 Remote user joined:", uid);
              setRemoteUid(uid);
            },
            onUserOffline: (_connection, uid) => {
              console.log("📴 Remote user left:", uid);
              setRemoteUid(null);
            },
            onLeaveChannel: () => {
              console.log("🚪 Left channel");
              setJoined(false);
              setRemoteUid(null);
            },
          });
          console.log("Agora event handlers registered.");

          // 3. Enable Video and Start Preview
          engine.enableVideo();
          engine.startPreview();
          console.log("Agora video preview started.");
          setIsReady(true); // Signal that the engine is ready and preview can be shown
        } catch (e) {
          console.error("Engine init error:", e);
        }
      };

      console.log("joined ?", joined);

      initEngine();

      // Return a cleanup function to release the engine on unmount
      return () => {
        if (engineRef.current) {
          console.log("Releasing Agora engine...");
          engineRef.current.release();
        }
      };
    }, []); // Empty dependency array ensures this runs only once.

    // Effect for joining the channel when props are ready
    useEffect(() => {
      // Guard against running before engine is ready or props are available
      if (isReady && engineRef.current && shouldConnect && token && roomName) {
        console.log("🔌 Props are ready, attempting to join channel...");
        engineRef.current.setClientRole(ClientRoleType.ClientRoleBroadcaster);
        engineRef.current.joinChannel(token, roomName, 0, {});
      }
    }, [isReady, shouldConnect, token, roomName]); // This effect re-runs when these props change

    console.log("joined ?", joined);

    useImperativeHandle(ref, () => ({
      disconnect: async () => {
        if (engineRef.current) {
          await engineRef.current.leaveChannel();
        }
        onEndCall?.();
      },
      flipCamera: () => {
        engineRef.current?.switchCamera();
        console.log("🔄 Camera flipped");
      },
    }));

    console.log("joined ?", joined);

    return (
      <View style={styles.container}>
        {/* Local View: Show if the engine is ready */}
        {isReady && (
          <RtcSurfaceView
            canvas={{ uid: 0 }}
            style={styles.localVideo}
            renderMode={1}
          />
        )}

        {/* Remote View: Show if a remote user has joined */}
        {joined && remoteUid ? (
          <RtcSurfaceView
            canvas={{ uid: remoteUid }}
            style={styles.remoteVideo}
            renderMode={1}
          />
        ) : (
          // Show "Connecting..." text only before the remote user joins
          <View style={styles.overlay}>
            <Text style={styles.statusText}>
              {joined ? "Waiting for others..." : "Connecting..."}
            </Text>
          </View>
        )}
      </View>
    );
  }
);

AgoraVideoComponent.displayName = "AgoraVideoComponent";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  // When remote user joins, local view becomes a picture-in-picture
  localVideo: {
    position: "absolute",
    width: 120,
    height: 160,
    right: 20,
    top: 40,
    zIndex: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  remoteVideo: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

export default AgoraVideoComponent;
