import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import FriendList from "./FriendList";
import Colors from "../../../constants/Colors";


const friends = [
  { id: "1", firstName: "Abdelsalam", lastName: "Ebrahim" },
  { id: "2", firstName: "Ahmed", lastName: "Hatoom" },
  { id: "3", firstName: "John", lastName: "Smith" },
  { id: "4", firstName: "Jane", lastName: "Doe" },
];

export default function FriendsList() {

  function renderItem({ item, index }) {
    const firstLetter = item.firstName.charAt(0).toUpperCase();
    const isNewLetter = index === 0 || friends[index - 1].firstName.charAt(0).toUpperCase() !== firstLetter;

    return (
      <>
        {isNewLetter && <Text style={styles.firstLetter}>{firstLetter}</Text>}
        <FriendList {...item} isLastName={index === friends.length - 1} />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends List</Text>

      <FlatList
        data={friends}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  title: {
    fontWeight: '500',
    fontSize: 24,
    color: Colors.MainColor,
    marginTop: 12,
  },
  firstLetter: {
    color: '#8A8A8A',
    fontWeight: '300',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
});
