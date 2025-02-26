import { useEffect, useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import Colors from "../../constants/Colors";


const CodeInput = ({ code, handleCodeChange }) => {

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

  return (
    <View style={styles.container}>
      {
        code.map((item, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={item}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={(value) => handleChange(value, index)}
            onFocus={() => handleFocus(index)} // Clear the input on focus
            ref={(e) => (refs.current[index] = e)} // Assign ref to each input
          />
        ))
      }
    </View>
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
  }
});