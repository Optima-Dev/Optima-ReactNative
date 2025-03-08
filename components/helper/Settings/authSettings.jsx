import { StyleSheet } from "react-native";
import AuthInput from "../../Auth/AuthInput";

const AuthSettings = () => {
  return (
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
  );
}

export default AuthSettings;

const styles = StyleSheet.create({
  authContainer: {
    gap: 4,
  },
});