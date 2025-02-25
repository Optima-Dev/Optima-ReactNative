import { StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/Colors";

const Signup = () => {
  return (
    <View style={styles.container}>
      <Text >Sign Up</Text>
    </View>
  );
}

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.SeconderyColor,
  },
});