const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Add required permissions for Twilio Video to AndroidManifest.xml
 */
const withTwilioVideoAndroid = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    // Add permissions to AndroidManifest
    const mainApplication = androidManifest.manifest.application[0];

    // Ensure permissions exist
    if (!androidManifest.manifest['uses-permission']) {
      androidManifest.manifest['uses-permission'] = [];
    }

    const permissions = [
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.ACCESS_WIFI_STATE',
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.BLUETOOTH',
      'android.permission.MODIFY_AUDIO_SETTINGS'
    ];

    // Add each permission if it doesn't already exist
    permissions.forEach(permission => {
      const exists = androidManifest.manifest['uses-permission'].some(
        (item) => item.$?.['android:name'] === permission
      );
      
      if (!exists) {
        androidManifest.manifest['uses-permission'].push({
          $: {
            'android:name': permission
          }
        });
      }
    });

    // Add feature requirements
    if (!androidManifest.manifest['uses-feature']) {
      androidManifest.manifest['uses-feature'] = [];
    }

    const features = [
      { name: 'android.hardware.camera', required: false },
      { name: 'android.hardware.camera.autofocus', required: false }
    ];

    features.forEach(feature => {
      const exists = androidManifest.manifest['uses-feature'].some(
        (item) => item.$?.['android:name'] === feature.name
      );
      
      if (!exists) {
        androidManifest.manifest['uses-feature'].push({
          $: {
            'android:name': feature.name,
            'android:required': feature.required.toString()
          }
        });
      }
    });

    return config;
  });
};

module.exports = withTwilioVideoAndroid;