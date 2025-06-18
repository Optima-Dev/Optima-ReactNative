// withTwilioVideoAndroid.js
const { withAndroidManifest } = require('expo/config-plugins');

/**
 * Expo Config Plugin to add necessary permissions for Twilio Video on Android
 * to AndroidManifest.xml
 */
const withTwilioVideoAndroid = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application[0];

    // Ensure we have the uses-permission nodes
    if (!androidManifest.manifest['uses-permission']) {
      androidManifest.manifest['uses-permission'] = [];
    }
    
    const usesPermissions = androidManifest.manifest['uses-permission'];
    
    // List of permissions needed for Twilio Video
    const permissions = [
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.MODIFY_AUDIO_SETTINGS',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.ACCESS_WIFI_STATE'
    ];
    
    // Add each permission if it doesn't exist already
    permissions.forEach(permission => {
      const existingPermission = usesPermissions.find(
        item => item.$?.['android:name'] === permission
      );
      
      if (!existingPermission) {
        usesPermissions.push({
          $: {
            'android:name': permission,
          },
        });
      }
    });
    
    // Add uses-feature for camera
    if (!androidManifest.manifest['uses-feature']) {
      androidManifest.manifest['uses-feature'] = [];
    }
    
    const usesFeatures = androidManifest.manifest['uses-feature'];
    
    const cameraFeature = usesFeatures.find(
      item => item.$?.['android:name'] === 'android.hardware.camera'
    );
    
    if (!cameraFeature) {
      usesFeatures.push({
        $: {
          'android:name': 'android.hardware.camera',
        },
      });
    }
    
    return config;
  });
};

module.exports = withTwilioVideoAndroid;
