import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { useState } from "react";


const SettingsItem = ({ leftLogo, rightLogo, title, subTitle, rowStyle, handleDarkMode, darkMode }) => {

  const [isDarkMode, setIsDarkMode] = useState(false);
  let imageSouce = rightLogo;

  function handleDarkMode() {
    setIsDarkMode(prevState => !prevState);
  }

  if(isDarkMode) {
    imageSouce = require('../../assets/Images/Toggle-on.png');
  }

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.logoContainer}>
        <Image source={leftLogo} style={[styles.logo, !rowStyle && styles.logoAccountStyle]} />
      </View>

      <View style={[styles.textContainer, rowStyle && styles.centerItems]}>
        <Text style={styles.textTitle}>{ title }</Text>
        <Text style={[styles.textSubTitle, rowStyle && styles.textSubTitle2]}>{ subTitle }</Text>
      </View>

      <Pressable
        style={styles.imageContainer}
        onPress={darkMode ? handleDarkMode : null}
      >
        <Image source={imageSouce}/>
      </Pressable>
    </View>
  );
}

export default SettingsItem;


const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: Colors.grey300,
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.MainColor,
    marginRight: 12,
  },
  logo: {
    width: 32,
    height: 32,
  },
  logoAccountStyle: {
    width: 42,
    height: 42,
  },
  textTitle: {
    color: Colors.MainColor,
    fontWeight: '500',
    fontSize: 20,
  },
  textSubTitle: {
    color: Colors.MainColor,
    fontSize: 16,
    fontWeight: '300',
  },
  textSubTitle2: {
    color: Colors.gray200,
  },
  centerItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginEnd: 14,
    flex: 1,
  },
  imageContainer: {
    marginLeft: 'auto',
  }
});