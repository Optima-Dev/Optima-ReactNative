import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import ForgetPassHeader from "../../Auth/ForgetPassHeader";
import MyPeopleForm from "./MyPeopleForm";
import MyPeopleList from "./MyPeopleList";


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
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === "ios" ? 8 : 20,
    marginTop: Platform.OS === "ios" ? 0 : 40,
    alignItems: Platform.OS === "android" ? "center" : null,
  },
});

export default MyPeopleContent;
