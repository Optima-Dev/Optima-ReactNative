import { StyleSheet, Text, View, Platform } from "react-native";
import BackButton from "../components/UI/BackButton";
import Colors from "../constants/Colors";
import AuthInput from "../components/Auth/AuthInput";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../components/UI/PrimaryButton";
import { useContext } from "react";
import { AuthContext } from "../store/AuthContext";


const Account = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <BackButton />

      <Text style={styles.title}>Account</Text>

      <View style={styles.logoContainer}>
        <Ionicons name="person-outline" size={40} color={Colors.MainColor} />
      </View>

      <View style={styles.authContainer}>
        <AuthInput
          icon='person-outline'
          onChangeText={() => {}}
          value="Sabrina"
        />
        <AuthInput
          icon='person-outline'
          onChangeText={() => {}}
          value="Donnelly"
        />
        <AuthInput
          icon='mail-outline'
          onChangeText={() => {}}
          value="Sabrina21d@gmail.com"
        />
      </View>

      <View style={styles.buttonsContainer}>
        <PrimaryButton
          backgroundColor={Colors.MainColor}
          isLoading={false}
          onPress={() => navigation.navigate('ForgetPassword')}
          textColor="white"
          title="Change Password"
        />
        <PrimaryButton
          backgroundColor={Colors.red600}
          isLoading={false}
          onPress={logout}
          textColor="white"
          title="Logout"
        />
      </View>
    </View>
  );
}

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  title: {
    color: Colors.MainColor,
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    padding: 20,
    backgroundColor: Colors.grey300,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.MainColor,
    alignSelf: 'center',
    marginBottom: 20,
  },
  authContainer: {
    gap: 4,
  },
  buttonsContainer: {
    gap: 15,
    marginTop: 40,
  }
});
