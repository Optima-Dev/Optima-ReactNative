import { StyleSheet, View } from "react-native";
import AuthInput from "../../Auth/AuthInput";

const MyPeopleFormInputs = ({ form, onChange, disabled }) => {
  return (
    <View style={styles.InputsContainer}>
      <AuthInput
        placeholder='First Name'
        value={form.firstName}
        onChangeText={(text) => onChange("firstName", text)}
        icon={"person-outline"}
      />
      <AuthInput
        placeholder='Last Name'
        value={form.lastName}
        onChangeText={(text) => onChange("lastName", text)}
        icon={"person-outline"}
      />
      <AuthInput
        placeholder='Email'
        value={form.email}
        onChangeText={(text) => onChange("email", text)}
        icon={"mail-outline"}
        isDisabled={disabled || null}
      />
    </View>
  );
}

export default MyPeopleFormInputs;

const styles = StyleSheet.create({
  InputsContainer: {
    marginBottom: 20,
    gap: 8,
  },
});