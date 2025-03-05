import { Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import Colors from '../../constants/Colors';
import SettingsItem from '../../components/Terms/SettingsItem';
import DetailItem from '../../components/Terms/DetailItem';

const Settings = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.subTitle}>Account</Text>
      <Pressable onPress={() => navigation.navigate('Account')}>
        <SettingsItem
          title="Sabrina Donnelly"
          subTitle="Sabrina21d@gmail.com"
          leftLogo={require('../../assets/Images/ion_person-outline.png')}
          rightLogo={require('../../assets/Images/Forward-Arrow.png')}
        />
      </Pressable>

      <Text style={styles.subTitle}>Settings</Text>
      <Pressable onPress={() => navigation.navigate('Language')}>
        <SettingsItem
          title="Language"
          subTitle="English"
          leftLogo={require('../../assets/Images/hugeicons_globe.png')}
          rightLogo={require('../../assets/Images/Forward-Arrow.png')}
          rowStyle
        />
      </Pressable>

      <SettingsItem
        title="Dark Mode"
        leftLogo={require('../../assets/Images/dark-mode.png')}
        rightLogo={require('../../assets/Images/Toggle-off.png')}
        rowStyle
        darkMode
      />

      <View style={styles.termsContainer}>
        <DetailItem
          text="Terms Of Service"
          iconSource={require("../../assets/Images/Forward-Arrow.png")}
          backgroundColor="#D0CFFC"
        />

        <DetailItem
          text="Privacy Policy"
          iconSource={require("../../assets/Images/Forward-Arrow.png")}
          backgroundColor="#D0CFFC"
        />
      </View>

    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 60 : 10,
    backgroundColor: 'white',
    gap: 20,
  },
  title: {
    textAlign: 'center',
    color: Colors.MainColor,
    fontWeight: '700',
    fontSize: 30,
    marginBottom: 30,
  },
  subTitle: {
    color: Colors.MainColor,
    fontSize: 24,
    fontWeight: '500',
  },
  termsContainer: {
    marginTop: 40,
    gap: 6,
  },
});