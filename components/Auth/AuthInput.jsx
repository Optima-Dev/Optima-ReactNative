import { useState } from "react";
import { View, TextInput, Pressable, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

function AuthInput({
  icon,
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  keyboardType,
  isInvalid,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(secureTextEntry);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prev) => !prev);
  }

  return (
    <View style={[styles.container, isInvalid && styles.containerInvalid]}>
      <Ionicons
        style={[styles.icon, isInvalid && styles.labelInvalid]}
        name={icon}
        size={25}
      />
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid]}
        placeholder={placeholder}
        secureTextEntry={isPasswordVisible}
        value={value}
        autoCapitalize='none'
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
      {secureTextEntry && (
        <Pressable onPress={togglePasswordVisibility}>
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color={Colors.grey400}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.MainColor,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginVertical: 6,
    backgroundColor: Colors.InputBackGround,
    width: Platform.OS === "android" ? 360 : "100%",
    height: 55,
  },
  containerInvalid: {
    borderColor: Colors.error500,
  },
  icon: {
    marginHorizontal: 10,
    color: Colors.MainColor,
  },
  labelInvalid: {
    color: Colors.error500,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.black,
    fontWeight: "300",
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
  },
});

export default AuthInput;
