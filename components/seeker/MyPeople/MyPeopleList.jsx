import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import PrimaryButton from "../../UI/PrimaryButton";
import Colors from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

function MyPeopleList({ people, onShowForm }) {
  function renderItem({ item }) {
    return (
      <View style={styles.personContainer}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.firstName.charAt(0).toUpperCase()}</Text>
        </View>

        {/* Name */}
        <Text style={styles.name}>{`${item.firstName} ${item.lastName}`}</Text>

        {/* Call Button */}
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name='call-outline' size={Platform.OS === 'ios' ? 28 : 20} color={Colors.MainColor} />
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
      <FlatList
        data={people}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        style={{ marginTop: 15 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === "ios" ? 0 : 16,
    marginVertical: Platform.OS === "ios" ? 22 : 0,
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
});

export default MyPeopleList;
