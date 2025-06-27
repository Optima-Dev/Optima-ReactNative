import { Platform } from "react-native";
import { PermissionsAndroid } from "react-native";

/**
 * Request camera and microphone permissions required for Twilio video calls
 * @returns {Promise<Object>} Object containing permission status
 */
export const requestTwilioPermissions = async () => {
  if (Platform.OS === "android") {
    try {
      const cameraGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "Optima needs access to your camera for video calls",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );

      const audioGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          message: "Optima needs access to your microphone for video calls",
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
      console.warn("Error requesting permissions:", err);
      return {
        cameraGranted: false,
        audioGranted: false,
      };
    }
  } else {
    // iOS handles permissions through Info.plist, which we assume is already configured
    // We return true for both permissions, as the system will automatically prompt if needed
    console.log("iOS platform detected - permissions handled by system");
    return {
      cameraGranted: true,
      audioGranted: true,
    };
  }
};

/**
 * Helper function to format participants for the UI
 * @param {Array} participants - List of participants from Twilio Room
 * @returns {Array} Formatted participants data
 */
export const formatParticipantsData = (participants) => {
  return Object.keys(participants).map((participantSid) => ({
    sid: participantSid,
    ...participants[participantSid],
  }));
};
