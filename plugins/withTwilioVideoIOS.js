// withTwilioVideoIOS.js
const { withInfoPlist } = require('expo/config-plugins');

/**
 * Expo Config Plugin to add necessary permission descriptions for Twilio Video
 * on iOS to Info.plist
 */
const withTwilioVideoIOS = (config) => {
  return withInfoPlist(config, (config) => {
    const infoPlist = config.modResults;
    
    // Add camera usage description
    if (!infoPlist.NSCameraUsageDescription) {
      infoPlist.NSCameraUsageDescription = "Allow Optima to access your camera for video calls with volunteers.";
    }
    
    // Add microphone usage description
    if (!infoPlist.NSMicrophoneUsageDescription) {
      infoPlist.NSMicrophoneUsageDescription = "Allow Optima to access your microphone for video calls with volunteers.";
    }
    
    return config;
  });
};

module.exports = withTwilioVideoIOS;
