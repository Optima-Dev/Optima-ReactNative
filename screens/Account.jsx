import { StyleSheet, Text, View, Platform } from "react-native";
import BackButton from "../components/UI/BackButton";
import Colors from "../constants/Colors";
import AuthInput from "../components/Auth/AuthInput";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../components/UI/PrimaryButton";
import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "../store/AuthContext";
import { useUser } from "../store/UserContext";
import { deleteUser, updateUser } from "../util/HttpUser";
import { useDebounce } from "../hooks/useDebounce";

const Account = ({ navigation }) => {
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { logout, token } = useContext(AuthContext);
  const { user, setUser } = useUser();
  const [updatedUser, setUpdatedUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  console.log(updatedUser);

  const onChange = useCallback((name, value) => {
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  }, []);

  const isDisabled = isEditing ? false : true;
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

  async function saveAccount() {
    setIsEditing(false);
    try {
      await updateUser(token, updatedUser);
      setUser(updatedUser);
      console.log("account updated");
    } catch (error) {
      console.log("can't update account", error);
    }
  }

  const buttons = isEditing ? (
    <>
      <PrimaryButton
        backgroundColor={Colors.MainColor}
        isLoading={false}
        onPress={saveAccount}
        textColor='white'
        title='Save'
      />
      <PrimaryButton
        backgroundColor={Colors.red600}
        isLoading={isDeletingAccount}
        onPress={deleteAccount}
        textColor='white'
        title='Delete Account'
      />
    </>
  ) : (
    <>
      <PrimaryButton
        backgroundColor={"white"}
        textColor={Colors.MainColor}
        isLoading={false}
        title='Edit'
        style={{ borderWidth: 4 }}
        onPress={() => setIsEditing(true)}
      />
      <PrimaryButton
        backgroundColor={Colors.MainColor}
        isLoading={false}
        onPress={() => navigation.navigate("ForgetPassword")}
        textColor='white'
        title='Change Password'
      />
      <PrimaryButton
        backgroundColor={Colors.red600}
        isLoading={isDeletingAccount}
        onPress={logout}
        textColor='white'
        title='Logout'
      />
    </>
  );

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
          onChangeText={(value) => {
            onChange("firstName", value);
          }}
          value={updatedUser.firstName}
          textStyle={styles.mainInputText}
          isDisabled={isDisabled}
        />
        <AuthInput
          icon='person-outline'
          onChangeText={(value) => {
            onChange("lastName", value);
          }}
          value={updatedUser.lastName}
          textStyle={styles.mainInputText}
          isDisabled={isDisabled}
        />
        <AuthInput
          icon='mail-outline'
          onChangeText={() => {}}
          value={user.email}
          textStyle={{ color: Colors.MainColor, fontWeight: "300" }}
          isDisabled={true}
        />
      </View>

      <View style={styles.buttonsContainer}>{buttons}</View>
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
  mainInputText: {
    color: Colors.MainColor,
    fontWeight: "500",
  },
});
