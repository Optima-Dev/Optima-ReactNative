import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import ForgetPassHeader from "../../Auth/ForgetPassHeader";
import PrimaryButton from "../../UI/PrimaryButton";
import MyPeopleForm from "./MyPeopleForm";
import MyPeopleList from "./MyPeopleList";
import Colors from "../../../constants/Colors";


function MyPeopleContent() {
  const [showForm, setShowForm] = useState(false);
  const [people, setPeople] = useState([]);

  function handleAddPerson(person) {
    setPeople((prevPeople) => [...prevPeople, person]);
    setShowForm(false);
  }

  const Subtitle = !showForm
    ? "Create a simple way to reach to your family and friends."
    : "Add the person’s information for a faster connection.";

  return (
    <View style={styles.container}>
      <ForgetPassHeader title='My People' subTitle={Subtitle} />
      {showForm ? (
        <MyPeopleForm
          onAddPerson={handleAddPerson}
          onHideForm={() => setShowForm(false)}
        />
      ) : (
        <MyPeopleList people={people} onShowForm={() => setShowForm(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 40,
  },
});

export default MyPeopleContent;
