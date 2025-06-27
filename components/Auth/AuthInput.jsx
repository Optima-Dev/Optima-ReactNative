import { useState } from "react";
import { View, TextInput, Pressable, StyleSheet, Platform, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

function AuthInput({
  icon,
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  keyboardType,
  textStyle,
  isDisabled,
  error,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(secureTextEntry);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prev) => !prev);
  }

  return (
    <>
      <View style={[styles.container, error && styles.errorInput]}>
        <Ionicons
          style={[styles.icon, error && styles.errorIcon]}
          name={icon}
          size={25}
        />
        <TextInput
          style={[styles.input, textStyle]}
          placeholder={placeholder}
          secureTextEntry={isPasswordVisible}
          value={value}
          autoCapitalize='none'
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          editable={!isDisabled}
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

      { error && <Text style={styles.errorMessage}>{ error }</Text> }
    </>
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
    // backgroundColor: Colors.InputBackGround,
    width: Platform.OS === "android" ? 360 : "100%",
    height: 55,
  },
  icon: {
    marginHorizontal: 10,
    color: Colors.MainColor,
  },
  errorIcon: {
    color: Colors.red600,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.black,
    fontWeight: "300",
  },
  errorInput: {
    borderColor: Colors.red600,
  },
  errorMessage: {
    marginLeft: 10,
    color: Colors.red600,
    fontSize: 16,
    fontWeight: "300",
    lineHeight: 22,
    marginBottom: 5,
  }
});

export default AuthInput;
