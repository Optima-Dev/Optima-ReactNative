import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import PrimaryButton from "../../UI/PrimaryButton";
import Colors from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const DUMMY_PEOPLE = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Doe",
  },
  {
    id: 3,
    firstName: "James",
    lastName: "Doe",
  },
  {
    id: 4,
    firstName: "Jenny",
    lastName: "Doe",
  },
  {
    id: 5,
    firstName: "Jared",
    lastName: "Doe",
  },
  {
    id: 6,
    firstName: "Jesse",
    lastName: "Doe",
  },
  {
    id: 7,
    firstName: "Jill",
    lastName: "Doe",
  },
  {
    id: 8,
    firstName: "Jack",
    lastName: "Doe",
  },
  {
    id: 9,
    firstName: "Jasmine",
    lastName: "Doe",
  },
  {
    id: 10,
    firstName: "Jasper",
    lastName: "Doe",
  },
];

function MyPeopleList({ people, onShowForm }) {
  function renderItem({ item }) {
    return (
      <View style={styles.personContainer}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.firstName.charAt(0)}</Text>
        </View>

        {/* Name */}
        <Text style={styles.name}>{`${item.firstName} ${item.lastName}`}</Text>

        {/* Call Button */}
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name='call-outline' size={20} color='blue' />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <PrimaryButton
        title='Add New Member'
        onPress={onShowForm}
        backgroundColor={Colors.MainColor}
        textColor={"white"}
      />
      {people.length > 0 ? (
        <FlatList
          data={people}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          style={{ marginTop: 15 }}
        />
      ) : (
        <Text style={styles.noBodyPhrase}>
          There is no one in the list at the current time.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  personContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAEAEA",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 12,
    borderWidth: 2,
    borderColor: Colors.MainColor,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#2727C473",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  name: {
    flex: 1,
    fontSize: 20,
    fontWeight: "500",
    color: Colors.MainColor,
  },
  callButton: {
    padding: 8,
  },
  noBodyPhrase: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.gray200,
    marginTop: 30,
    fontWeight: "bold",
  },
});

export default MyPeopleList;
