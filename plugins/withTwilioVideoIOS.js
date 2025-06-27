const { withInfoPlist } = require('@expo/config-plugins');

/**
 * Add required permissions for Twilio Video to Info.plist
 */
const withTwilioVideoIOS = (config) => {
  return withInfoPlist(config, (config) => {
    const infoPlist = config.modResults;
    
    // Add camera usage description if not present
    if (!infoPlist.NSCameraUsageDescription) {
      infoPlist.NSCameraUsageDescription = 'Optima needs access to your camera for video calls with volunteers';
    }
    
    // Add microphone usage description if not present
    if (!infoPlist.NSMicrophoneUsageDescription) {
      infoPlist.NSMicrophoneUsageDescription = 'Optima needs access to your microphone for audio during video calls';
    }
    
    return config;
  });
};

module.exports = withTwilioVideoIOS;