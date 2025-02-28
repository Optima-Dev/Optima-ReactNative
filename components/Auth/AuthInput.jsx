import { useState } from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

function AuthInput({
  icon,
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(secureTextEntry);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prev) => !prev);
  }

  return (
    <View style={styles.container}>
      <Ionicons style={styles.icon} name={icon} size={25} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={isPasswordVisible}
        value={value}
        onChangeText={onChangeText}
      />
      {secureTextEntry && (
        <Pressable onPress={togglePasswordVisibility}>
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color= {Colors.grey400}
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
    width: '100%',
    height: 55,
  },
  icon: {
    marginHorizontal: 10,
    color: Colors.MainColor,
  },
  input: {
    flex: 1,
    // width: 260,
    fontSize: 15,
    color: Colors.black,
    fontWeight: 300,
  }
});

export default AuthInput;
