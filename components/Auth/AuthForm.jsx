import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import AuthInput from "./AuthInput";
import Colors from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";

function AuthForm({ type, form, onChange }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {type === "signup" && (
        <>
          <AuthInput
            icon="person-outline"
            placeholder="First Name"
            value={form.firstName}
            onChangeText={(text) => onChange("firstName", text)}
          />
          <AuthInput
            icon="person-outline"
            placeholder="Last Name"
            value={form.lastName}
            onChangeText={(text) => onChange("lastName", text)}
          />
        </>
      )}
      <AuthInput
        icon="mail-outline"
        placeholder="example@gmail.com"
        value={form.email}
        onChangeText={(text) => onChange("email", text)}
      />
      <AuthInput
        icon="lock-closed-outline"
        placeholder="********"
        secureTextEntry={true}
        value={form.password}
        onChangeText={(text) => onChange("password", text)}
      />
      {type === "login" && (
        <Pressable
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate("ForgetPassword")}
        >
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
  },
  forgotPassword: {
    color: Colors.MainColor,
    textAlign: "right",
    marginBottom: 5,
    marginRight: 5,
    marginTop: Platform.OS === "android" ? 0 : 5,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default AuthForm;