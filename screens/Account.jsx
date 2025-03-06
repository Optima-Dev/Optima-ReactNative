import { StyleSheet, Text, View, Platform } from "react-native";
import BackButton from "../components/UI/BackButton";
import Colors from "../constants/Colors";
import AuthInput from "../components/Auth/AuthInput";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../components/UI/PrimaryButton";
import { useContext, useState } from "react";
import { AuthContext } from "../store/AuthContext";
import { useUser } from "../store/UserContext";
import { deleteUser } from "../util/HttpUser";

const Account = ({ navigation }) => {

  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const { logout, token } = useContext(AuthContext);
  const { user } = useUser();


  async function deleteAccount() {
    setIsDeletingAccount(true);
    try {
      await deleteUser(token);
      logout();
      console.log("account deleted");
    } catch (error) {
      console.log("can't delete account", error);
    }
    setIsDeletingAccount(false);
  }

  return (
    <View style={styles.container}>
      <BackButton />

      <Text style={styles.title}>Account</Text>

      <View style={styles.logoContainer}>
        <Ionicons name='person-outline' size={40} color={Colors.MainColor} />
      </View>

      <View style={styles.authContainer}>
        <AuthInput
          icon='person-outline'
          onChangeText={() => {}}
          value={user.firstName}
        />
        <AuthInput
          icon='person-outline'
          onChangeText={() => {}}
          value={user.lastName}
        />
        <AuthInput
          icon='mail-outline'
          onChangeText={() => {}}
          value={user.email}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <PrimaryButton
          backgroundColor={Colors.MainColor}
          isLoading={false}
          onPress={() => navigation.navigate("ForgetPassword")}
          textColor='white'
          title='Change Password'
        />
        <PrimaryButton
          backgroundColor={Colors.red600}
          isLoading={false}
          onPress={logout}
          textColor='white'
          title='Logout'
        />
        <PrimaryButton
          backgroundColor="#555555"
          isLoading={isDeletingAccount}
          onPress={deleteAccount}
          textColor='white'
          title='Delete Account'
        />
      </View>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  title: {
    color: Colors.MainColor,
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
  logoContainer: {
    padding: 20,
    backgroundColor: Colors.grey300,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.MainColor,
    alignSelf: "center",
    marginBottom: 20,
  },
  authContainer: {
    gap: 4,
  },
  buttonsContainer: {
    gap: 15,
    marginTop: 40,
  },
});
