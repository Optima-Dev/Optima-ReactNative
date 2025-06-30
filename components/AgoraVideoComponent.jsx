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
  ActivityIndicator,
} from "react-native";
import {
  createAgoraRtcEngine,
  RtcSurfaceView,
  ChannelProfileType,
  RenderModeType,
} from "react-native-agora";

// Permission request helper function
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

// This component is generic and handles rendering for both Seeker and Helper
const AgoraVideoComponent = forwardRef(
  (
    {
      token,
      channelName,
      appId,
      uid,
      onEndCall,
      shouldConnect,
      alwaysShowLocalFullScreen = false,
      remoteUserName,
      onRemoteUserJoined,
    },
    ref
  ) => {
    const engineRef = useRef(null);
    const [isJoined, setIsJoined] = useState(false);
    const [remoteUid, setRemoteUid] = useState(null);
    const [isEngineReady, setIsEngineReady] = useState(false);
    const [hasPermission, setHasPermission] = useState(true);

    // Effect to initialize the Agora engine once
    useEffect(() => {
      const initEngine = async () => {
        if (!appId) {
          console.error("[Agora] App ID is missing. Cannot initialize.");
          return;
        }
        const permission = await requestAndroidPermissions();
        if (!permission) {
          setHasPermission(false);
          return;
        }

        try {
          engineRef.current = createAgoraRtcEngine();
          engineRef.current.initialize({
            appId,
            channelProfile: ChannelProfileType.ChannelProfileCommunication,
          });

          // Register all event handlers
          engineRef.current.registerEventHandler({
            onJoinChannelSuccess: (connection) => {
              console.log(
                `✅ [${uid}] Successfully joined channel: ${connection.channelId}`
              );
              setIsJoined(true);
            },
            onUserJoined: (_, rUid) => {
              console.log(`✅ [${uid}] Remote user ${rUid} has joined.`);
              setRemoteUid(rUid);
              onRemoteUserJoined?.();
            },
            onUserOffline: () => {
              console.log(`❌ [${uid}] Remote user has left.`);
              setRemoteUid(null);
              onEndCall?.();
            },
            onLeaveChannel: () => {
              setIsJoined(false);
              setRemoteUid(null);
            },
            onError: (err, msg) => {
              console.error(
                `❌ [${uid}] Agora Error Code: ${err}, Message: ${msg}`
              );
            },
          });

          engineRef.current.enableVideo();
          engineRef.current.startPreview();
          setIsEngineReady(true); // Give the "green light"
        } catch (e) {
          console.error("Engine init error:", e);
        }
      };
      initEngine();
      return () => engineRef.current?.release();
    }, [appId]); // Runs once per call

    // Effect to join the channel once the engine is ready
    useEffect(() => {
      if (
        isEngineReady &&
        shouldConnect &&
        token &&
        channelName &&
        typeof uid === "number"
      ) {
        console.log(
          `[${uid}] Engine is ready. Joining channel "${channelName}"...`
        );
        engineRef.current?.joinChannel(token, channelName, uid, {});
        engineRef.current?.setEnableSpeakerphone(true);
      }
    }, [isEngineReady, shouldConnect, token, channelName, uid]);

    // Expose functions to the parent component
    useImperativeHandle(ref, () => ({
      disconnect: async () => await engineRef.current?.leaveChannel(),
      flipCamera: () => engineRef.current?.switchCamera(),
    }));

    // --- RENDER LOGIC ---
    if (!hasPermission)
      return (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Camera and Mic permissions are required.
          </Text>
        </View>
      );

    const localViewStyle = alwaysShowLocalFullScreen
      ? styles.fullScreenVideo
      : styles.pipVideo;
    const remoteViewStyle = alwaysShowLocalFullScreen
      ? styles.pipVideo
      : styles.fullScreenVideo;
    const showWaitingOverlay = isJoined && !remoteUid;

    if (!isEngineReady) {
      return (
        <View style={styles.placeholder}>
          <ActivityIndicator color='#FFF' />
          <Text style={styles.placeholderText}>Initializing Engine...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <RtcSurfaceView
          canvas={{ uid: 0 }}
          style={localViewStyle}
          renderMode={RenderModeType.RenderModeHidden}
          zOrderMediaOverlay={true}
        />
        {remoteUid && (
          <RtcSurfaceView
            canvas={{ uid: remoteUid }}
            style={remoteViewStyle}
            renderMode={RenderModeType.RenderModeHidden}
          />
        )}

        {showWaitingOverlay && (
          <View style={styles.waitingOverlay}>
            <ActivityIndicator size='large' color='#FFF' />
            <Text style={styles.waitingText}>
              Waiting for {remoteUserName || "friend"} to join...
            </Text>
          </View>
        )}

        {!isJoined && isEngineReady && (
          <View style={styles.placeholder}>
            <ActivityIndicator color='#FFF' />
            <Text style={styles.placeholderText}>Connecting...</Text>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenVideo: { ...StyleSheet.absoluteFillObject },
  pipVideo: {
    position: "absolute",
    width: 120,
    height: 180,
    right: 16,
    top: Platform.OS === "ios" ? 60 : 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    overflow: "hidden",
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
  },
  waitingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  waitingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});

export default AgoraVideoComponent;
