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

// APP_ID is now passed as a prop, no longer hardcoded.

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
  // FIX: Accept appId, uid, and channelName from props
  ({ token, channelName, appId, uid, onEndCall, shouldConnect }, ref) => {
    const engineRef = useRef(null);
    const [joined, setJoined] = useState(false);
    const [remoteUid, setRemoteUid] = useState(null);
    const [isReady, setIsReady] = useState(false); 

    // Effect for initializing and destroying the Agora engine (runs only once)
    useEffect(() => {
      const initEngine = async () => {
        if (!appId) {
            console.error("appId is missing. Cannot initialize Agora engine.");
            return;
        }

        const hasPermission = await requestAndroidPermissions();
        if (!hasPermission) {
          console.warn("Permissions not granted. Cannot start camera.");
          return;
        }

        try {
          console.log("Initializing Agora engine...");
          const engine = createAgoraRtcEngine();
          engineRef.current = engine;

          engine.initialize({
            appId: appId,
            channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
          });
          console.log("Agora engine initialized.");

          engine.registerEventHandler({
            onJoinChannelSuccess: (connection, _elapsed) => {
              console.log("✅ Joined channel successfully:", connection.channelId);
              setJoined(true);
            },
            onUserJoined: (_connection, rUid) => {
              console.log("📡 Remote user joined:", rUid);
              setRemoteUid(rUid);
            },
            onUserOffline: (_connection, rUid) => {
              console.log("📴 Remote user left:", rUid);
              setRemoteUid(null);
            },
            onLeaveChannel: () => {
              console.log("🚪 Left channel");
              setJoined(false);
              setRemoteUid(null);
            },
            onError: (err, msg) => {
                console.error("❌ Agora Error:", "Code:", err, "Msg:", msg);
            }
          });
          console.log("Agora event handlers registered.");
          
          engine.enableVideo();
          engine.startPreview();
          console.log("Agora video preview started.");
          setIsReady(true);

        } catch (e) {
          console.error("Engine init error:", e);
        }
      };

      initEngine();

      // Return a cleanup function to release the engine on unmount
      return () => {
        if (engineRef.current) {
          console.log("Releasing Agora engine...");
          engineRef.current.release();
        }
      };
    }, [appId]); // Re-initialize only if appId changes.

    useEffect(() => {
      // FIX: Use channelName and ensure uid is a number
      if (isReady && engineRef.current && shouldConnect && token && channelName && typeof uid === 'number') {
        console.log(`🔌 Props ready. Joining channel: ${channelName} with UID: ${uid}`);
        engineRef.current.setClientRole(ClientRoleType.ClientRoleBroadcaster);
        engineRef.current.joinChannel(token, channelName, uid, {});
      }
    }, [isReady, shouldConnect, token, channelName, uid]); 

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

    return (
      <View style={styles.container}>
        {/* Local user view uses UID 0 until channel is joined */}
        {isReady && <RtcSurfaceView canvas={{ uid: 0 }} style={styles.localVideo} renderMode={1} />}

        {joined && remoteUid ? (
          <RtcSurfaceView canvas={{ uid: remoteUid }} style={styles.remoteVideo} renderMode={1} />
        ) : (
          // Show "Connecting..." text only before the remote user joins
          <View style={styles.overlay}>
            <Text style={styles.statusText}>{joined ? 'Waiting for others...' : 'Connecting...'}</Text>
          </View>
        )}
      </View>
    );
  }
);

AgoraVideoComponent.displayName = 'AgoraVideoComponent';

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
    position: 'absolute',
    width: 120,
    height: 160,
    right: 20,
    top: 40,
    zIndex: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  remoteVideo: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

export default AgoraVideoComponent;
