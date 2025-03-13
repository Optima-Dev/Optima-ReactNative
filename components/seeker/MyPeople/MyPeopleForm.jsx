import { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import PrimaryButton from "../../UI/PrimaryButton";
import Colors from "../../../constants/Colors";
import MyPeopleFormInputs from "./MyPeopleFormInputs";
import { validateEmail, validateName } from "../../../util/Validation";

function MyPeopleForm({ onAddPerson, onHideForm, isLoading }) {
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
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

  async function handleSubmit() {
    const isFirstName = validateName(peopleForm.firstName);
    const isLastName = validateName(peopleForm.lastName);
    const isEmail = validateEmail(peopleForm.email);

    if (!(isFirstName || isLastName || isEmail)) {
      await onAddPerson(peopleForm);
      onHideForm();
    } else {
      setError({
        firstName: isFirstName,
        lastName: isLastName,
        email: isEmail,
      });
    }
  }

  return (
    <View style={styles.container}>
      <MyPeopleFormInputs form={peopleForm} onChange={handleChangeInputs} error={error} />

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
  ButtonsContainer: {
    gap: 15,
  },
});

export default MyPeopleForm;
