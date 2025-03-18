import { useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CameraView } from 'expo-camera';

import PrimaryButton from '../../components/UI/PrimaryButton';
import Colors from '../../constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { BallIndicator } from 'react-native-indicators';


const DUMMMY_ANSWER = `This image features an open notebook with a mix of text, illustrations, and designs. Left Page:\n
Text: The page contains hand-written text in what appears to be Chinese characters.\n
There is a large amount of blue text at the top and black text in the middle\n
Graphic Element: A block labeled "CAPTURE ONE" is in the center, featuring details about "Capture One 21 Pro" software, including a version number (14.2.0.48) and copyright information (1999–2021 Capture One A/S).\n
Drawing: A small green-colored cup or plant with handwritten words.
`

const MyVision = () => {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const cameraRef = useRef();
  const [uri, setUri] = useState();
  const [isLoading, setIsLoading] = useState(true);


  useFocusEffect(() => {
    setIsCameraActive(true);

    return () => setIsCameraActive(false);
  });

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setUri(photo.uri);

      await getInfoFromAi();
    }
  }

  async function reTakePicture() {
    setUri(null);
  }

  async function getInfoFromAi() {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }

  return (
    <View style={styles.container}>

      {
        uri ? (
          <>
            <Image source={{ uri }} style={{ flex: 1 }} />
            <ScrollView style={styles.answerContainer}>
              {/* <Image source={require('../../assets/Images/mingcute_voice-fill.png')} style={styles.voiceLogo} /> */}
              
              { !isLoading && <Text style={styles.answer}>{ DUMMMY_ANSWER }</Text> }
              { isLoading && (
                <BallIndicator
                  color='white'
                  size={80}
                  count={9}
                  style={{ top: '360%' }}
                />
              ) }
            </ScrollView>
          </>
        ) : (
          isCameraActive && <CameraView style={{ flex: 1 }} ref={cameraRef} />
        )
      }

      <View style={styles.buttonsContainer}>
        <PrimaryButton
          title="Take A Picture"
          backgroundColor={Colors.MainColor}
          textColor="white"
          isLoading={false}
          onPress={uri ? reTakePicture : takePicture}
          style={{ width: uri ? '49%' : '100%' }}
        />

        { uri && (
          <PrimaryButton
            title="Repeat"
            backgroundColor={Colors.green500}
            textColor={Colors.MainColor}
            isLoading={false}
            onPress={getInfoFromAi}
            style={{ width: '49%' }}
          />
        )}
      </View>

    </View>
  );
}

export default MyVision;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  answerContainer: {
    backgroundColor: '#41403DD6',
    position: 'absolute',
    margin: 20,
    width: '90%',
    height: '88%', // 'auto' to fit content
    borderRadius: 22,
  },
  answer: {
    padding: 10,
    fontSize: 20,
    fontWeight: '300',
    color: Colors.white,
    lineHeight: 28,
  },
  voiceLogo: {
    position: 'absolute',
    right: -20,
    top: -20,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    marginVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});