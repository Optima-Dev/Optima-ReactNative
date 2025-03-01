import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AuthContext } from "../store/AuthContext";
import PrimaryButton from "../components/UI/PrimaryButton";
import Colors from "../constants/Colors";


const Instructions = ({ navigation }) => {

  const { role } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text>Instruction Screen</Text>

      <PrimaryButton
        title="Got it"
        backgroundColor={Colors.MainColor}
        textColor={Colors.white}
        onPress={() => navigation.navigate(role)}
      />
    </View>
  );
}

export default Instructions;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});