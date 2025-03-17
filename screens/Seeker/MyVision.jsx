import { useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { CameraView } from 'expo-camera';

import PrimaryButton from '../../components/UI/PrimaryButton';
import Colors from '../../constants/Colors';

const MyVision = () => {
  const cameraRef = useRef();
  const [uri, setUri] = useState();

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setUri(photo.uri);
    }
  }

  async function reTakePicture() {
    setUri(null);
  }

  return (
    <View style={styles.container}>

      {
        uri ? (
          <Image
            source={{ uri }}
            style={styles.camera}
          />
        ) : (
          <CameraView
            style={styles.camera}
            ref={cameraRef}
          />
        )
      }

      <View style={styles.buttonsContainer}>
        <PrimaryButton
          title="Take A Picture"
          backgroundColor={Colors.MainColor}
          textColor="white"
          isLoading={false}
          onPress={takePicture}
          style={{ width: uri ? '48%' : '100%' }}
        />

        {
          uri && (
            <PrimaryButton
              title="Repeat"
              backgroundColor={Colors.green500}
              textColor={Colors.MainColor}
              isLoading={false}
              onPress={reTakePicture}
              style={{ width: '48%' }}
            />
          )
        }
      </View>
    </View>
  );
}

export default MyVision;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  camera: {
    flex: 1,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  focuedCamera: {
    backgroundColor: 'white',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});