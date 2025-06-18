import { Platform, PermissionsAndroid } from "react-native";

/**
 * Requests camera and microphone permissions for Twilio Video on Android
 * iOS permissions are handled through Info.plist
 */
export const requestTwilioPermissions = async () => {
  if (Platform.OS === "android") {
    try {
      const cameraGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "Optima needs access to your camera to make video calls.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );

      const audioGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          message:
            "Optima needs access to your microphone to make video calls.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );

      return {
        cameraGranted: cameraGranted === PermissionsAndroid.RESULTS.GRANTED,
        audioGranted: audioGranted === PermissionsAndroid.RESULTS.GRANTED,
      };
    } catch (err) {
      console.error("Error requesting permissions:", err);
      return {
        cameraGranted: false,
        audioGranted: false,
      };
    }
  } else {
    // iOS permissions are handled through Info.plist
    return {
      cameraGranted: true,
      audioGranted: true,
    };
  }
};

/**
 * Handle Twilio video track subscription events
 */
export const handleTrackSubscription = (participant, track, twilioRef) => {
  // You can implement custom behavior for different track types
  // This can be useful for accessibility features or UI changes
  if (track.kind === "video") {
    console.log("Participant video track subscribed:", participant.identity);
    // Example: You might want to play a sound or speech notification for blind users
  }
  if (track.kind === "audio") {
    console.log("Participant audio track subscribed:", participant.identity);
  }
};

/**
 * Format error messages from Twilio for better user feedback
 */
export const formatTwilioError = (error) => {
  if (!error) return "Unknown error occurred";

  const errorCode = error.code || "";
  const errorMessage = error.message || "";

  // Handle common Twilio error codes
  switch (errorCode) {
    case 20101: // Invalid Access Token
      return "Connection error: Invalid access token";
    case 53000: // Room name is invalid
      return "Connection error: Invalid room name";
    case 53001: // Room name too long
      return "Connection error: Room name is too long";
    case 53103: // Maximum number of concurrent Participants
      return "The room is full";
    case 53105: // Room is disconnected
      return "The call has ended";
    default:
      return `Error: ${errorMessage || "Unknown error"}`;
  }
};
