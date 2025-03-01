import { StyleSheet, Text, View } from 'react-native';

const MyVision = () => {
  return (
    <View style={styles.container}>
      <Text>MyVision</Text>
    </View>
  );
}

export default MyVision;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});