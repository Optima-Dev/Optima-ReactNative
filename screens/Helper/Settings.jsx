import { useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../../store/AuthContext';

const Settings = () => {

  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <Button onPress={logout} title='logout' />
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  }
});