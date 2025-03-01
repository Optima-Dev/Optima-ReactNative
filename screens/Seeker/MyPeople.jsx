import { StyleSheet, Text, View } from 'react-native';

const MyPeople = () => {
  return (
    <View style={styles.container}>
      <Text>MyPeople</Text>
    </View>
  );
}

export default MyPeople;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});