import { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import PrimaryButton from "../../UI/PrimaryButton";
import Colors from "../../../constants/Colors";
import MyPeopleFormInputs from "./MyPeopleFormInputs";

function MyPeopleForm({ onAddPerson, onHideForm, isLoading }) {
  const [peopleForm, setPeopleForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  function handleChangeInputs(key, value) {
    setPeopleForm((prevState => {
      return {
        ...prevState,
        [key]: value,
      }
    }));
  }

  function handleSubmit() {
    if (peopleForm.firstName && peopleForm.lastName && peopleForm.email) {
      onAddPerson(peopleForm); // Pass the full object
    } else {
      alert("Error", "Please fill all the fields", [{ text: "Okay" }]);
    }
  }

  return (
    <View style={styles.container}>
      <MyPeopleFormInputs form={peopleForm} onChange={handleChangeInputs} />

      <View style={styles.ButtonsContainer}>
        <PrimaryButton
          title='Add Member'
          onPress={handleSubmit}
          backgroundColor={Colors.MainColor}
          textColor={"white"}
          isLoading={isLoading}
        />
        <PrimaryButton
          title='Cancel'
          onPress={onHideForm}
          backgroundColor={"white"}
          style={{ borderWidth: 4 }}
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
