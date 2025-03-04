import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

const ForgetPassHeader = ({ title, subTitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ title }</Text>
      <Text style={styles.subTitle}>{ subTitle }</Text>
    </View>
  );
}

export default ForgetPassHeader;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: 700,
    color: Colors.MainColor,
  },
  subTitle: {
    fontSize: 20,
    marginVertical: 10,
    textAlign: "center",
  }
});