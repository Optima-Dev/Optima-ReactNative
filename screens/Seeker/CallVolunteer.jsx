import { useLayoutEffect, useState } from 'react';
import { ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../../components/UI/PrimaryButton';
import Colors from '../../constants/Colors';

const CallVolunteer = ({ navigation }) => {
  const [isCalling, setIsCalling] = useState(false);

  useLayoutEffect(() => {
    const parentNav = navigation.getParent(); 
    parentNav?.setOptions({tabBarStyle: { display: 'none' } });

    return () => {
      parentNav?.setOptions({
        tabBarStyle: {
          display: 'flex',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          marginBottom: Platform.OS === "ios" ? 0 : 12,
        }
      });
    }
  }, [navigation]);

  function handleEndingCall() {
    setIsCalling(false);
    navigation.goBack();
  }

  function handleFlipCamera() {
    // Logic for flipping the camera goes here
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {isCalling ? (
            // replace it with video call component 
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 40, fontWeight: '700', color: Colors.MainColor }}>
                Connecting...
              </Text>
            </View>
          ) : (
            <>
              <ImageBackground
                source={require('../../assets/Images/volunteer.jpeg')}
                style={styles.personImage}
                blurRadius={12}
              />
              <Text style={styles.waiting}>Wait for someone to join you ..</Text>
            </>
          )}
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          backgroundColor={Colors.MainColor}
          textColor="white"
          title="Flip Camera"
          style={styles.button}
          onPress={handleFlipCamera}
        />

        <PrimaryButton
          backgroundColor={Colors.red600}
          textColor="white"
          title="End Call"
          style={styles.button}
          onPress={handleEndingCall}
        />
      </View>
    </View>
  );
}

export default CallVolunteer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personImage: {
    flex: 1,
    width: '100%',
  },
  waiting: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.white,
    position: 'absolute',
    marginHorizontal: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: '#1E1E1E80',
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  button: {
    width: '49%',
  }
});