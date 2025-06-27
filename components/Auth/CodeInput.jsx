import { useEffect, useRef } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import Colors from "../../constants/Colors";


const CodeInput = ({ verificationCode, handleCodeChange, error }) => {

  const refs = useRef([]);

  useEffect(() => {
    if (refs.current[0]) {
      refs.current[0].focus();
    }
  }, []);

  function handleChange(value, index) {
    handleCodeChange(value, index);

    if (value && index < 3) {
      refs.current[index + 1].focus();
    }
  };

  // Clear the input when it is focused
  function handleFocus(index) {
    handleCodeChange('', index); 
  };

  console.log(error);
  return (
    <>
      <View style={styles.container}>
        {
          verificationCode.map((item, index) => (
            <TextInput
              key={`code-input-${index}`}
              style={[styles.input, error && styles.inputError]}
              value={item}
              maxLength={1}
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(value) => handleChange(value, index)}
              onFocus={() => handleFocus(index)} // Clear the input on focus
              ref={(e) => (refs.current[index] = e)} // Assign ref to each input
            />
          ))
        }
      </View>
      { error && <Text style={styles.errorMessage}>{ error }</Text> }
    </>
  );
}

export default CodeInput;


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.MainColor,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '500',
  },
  inputError: {
    borderColor: Colors.red600,
  },
  errorMessage: {
    marginLeft: 10,
    color: Colors.red600,
    fontSize: 18,
    fontWeight: "300",
    lineHeight: 22,
    marginTop: 10,
  }
});