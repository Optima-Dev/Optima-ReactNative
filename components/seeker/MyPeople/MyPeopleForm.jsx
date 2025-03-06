import { useState } from "react";
import { View, StyleSheet, Alert, Platform } from "react-native";
import PrimaryButton from "../../UI/PrimaryButton";
import AuthInput from "../../Auth/AuthInput";
import Colors from "../../../constants/Colors";
import { validateEmail, validateName } from "../../../util/Validation";

function MyPeopleForm({ onAddPerson, onHideForm }) {
  const [peopleForm, setPeopleForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  function handleSubmit() {
    if (peopleForm.firstName && peopleForm.lastName && peopleForm.email) {
      console.log("Form submitted in my people");
      onAddPerson(peopleForm);
    } else {
      Alert.alert("Error", "Please fill all the fields", [{ text: "Okay" }]);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.InputsContainer}>
        <AuthInput
          placeholder='First Name'
          value={peopleForm.firstName}
          onChangeText={(text) =>
            setPeopleForm({ ...peopleForm, firstName: text })
          }
          icon={"person-outline"}
        />
        <AuthInput
          placeholder='Last Name'
          value={peopleForm.lastName}
          onChangeText={(text) =>
            setPeopleForm({ ...peopleForm, lastName: text })
          }
          icon={"person-outline"}
        />
        <AuthInput
          placeholder='Email'
          value={peopleForm.email}
          onChangeText={(text) => setPeopleForm({ ...peopleForm, email: text })}
          icon={"mail-outline"}
        />
      </View>
      <View style={styles.ButtonsContainer}>
        <PrimaryButton
          title='Add Member'
          onPress={handleSubmit}
          backgroundColor={Colors.MainColor}
          textColor={"white"}
        />
        <PrimaryButton
          title='Cancel'
          onPress={onHideForm}
          backgroundColor={"white"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === "ios" ? 0 : 16,
  },
  InputsContainer: {
    marginBottom: 20,
    gap: 8,
  },
  ButtonsContainer: {
    gap: 15,
  },
});

export default MyPeopleForm;
