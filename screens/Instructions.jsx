import { StyleSheet, Text, View } from "react-native";

const Instructions = () => {
  return (
    <View style={styles.container}>
      <Text>Instruction Screen</Text>
    </View>
  );
}

export default Instructions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});