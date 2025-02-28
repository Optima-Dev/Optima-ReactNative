import { StyleSheet, View } from "react-native";
import AuthContent from "../../components/Auth/AuthContent";
import Colors from "@/constants/Colors";

function Signup({route}) {
  const { role } = route.params;
  return (
    <View style={styles.container}>
      <AuthContent type="signup" role={role} />
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