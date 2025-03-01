import { StyleSheet, Text, View } from 'react-native';

const Community = () => {
  return (
    <View style={styles.container}>
      <Text>Community</Text>
    </View>
  );
}

export default Community;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});