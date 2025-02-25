import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import AuthInput from "./AuthInput";
import Colors from "../../constants/Colors";

function AuthForm({ type }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <View style={styles.container}>
      {type === "signup" && (
        <>
          <AuthInput
            icon='person-outline'
            placeholder='First Name'
            value={form.firstName}
            onChangeText={(text) => handleChange("firstName", text)}
          />
          <AuthInput
            icon='person-outline'
            placeholder='Last Name'
            value={form.lastName}
            onChangeText={(text) => handleChange("lastName", text)}
          />
        </>
      )}
      <AuthInput
        icon='mail-outline'
        placeholder='example@gmail.com'
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
      />
      <AuthInput
        icon='lock-closed-outline'
        placeholder='********'
        secureTextEntry={true}
        value={form.password}
        onChangeText={(text) => handleChange("password", text)}
      />
      {type === "login" && (
        <Pressable style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPassword}>Forgot Password ?</Text>
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
    fontSize: 14,
    fontWeight: "600",
  },
});

export default AuthForm;
