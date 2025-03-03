import { StyleSheet, Text, View } from "react-native";


const Support = () => {
  return (
    <View style={styles.container}>
      <Text>Support</Text>
    </View>
  );
}

export default Support;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});