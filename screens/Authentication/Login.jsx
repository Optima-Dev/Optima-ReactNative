import { View, StyleSheet } from "react-native";
import AuthContent from "../../components/Auth/AuthContent";
import Colors from "@/constants/Colors";

function Login() {
  return (
    <View style={styles.container}>
      <AuthContent type='login' />
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
});
