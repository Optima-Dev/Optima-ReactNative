import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { useState } from "react";


const FriendList = ({ firstName, lastName, isLastName }) => {
  const [isAdded, setIsAdded] = useState(true);

  return (
    <View style={[styles.container, isLastName && { borderBottomWidth: 0 }]}>
      
      <View style={styles.avatar}>
        <Ionicons name="person-outline" size={32} color="white" />
      </View>

      <Text style={styles.name}>{ firstName + ' ' + lastName }</Text>

      <Pressable
        style={[styles.buttonContainer, isAdded ? styles.added : styles.add]}
        onPress={() => setIsAdded((prev) => !prev)}
      >
        <Text style={[styles.buttontext, isAdded ? styles.addedText : styles.addText]}>
          {isAdded ? 'Added' : 'Add'}
        </Text>
      </Pressable>

    </View>
  );
}

export default FriendList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: '#8A8A8A',
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
  avatar: {
    borderRadius: 8,
    backgroundColor: "#2727C473",
    padding: 6,
    marginRight: 10,
  },
  name: {
    fontWeight: '600',
    fontSize: 18,
    color: Colors.MainColor,
  },
  buttonContainer: {
    width: 101,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 'auto',
  },
  added: {
    backgroundColor: Colors.MainColor,
    borderColor: Colors.MainColor,
    borderWidth: 4,
  }, 
  add: {
    borderWidth: 4,
    borderColor: Colors.MainColor,
    backgroundColor: 'white',
  },
  addedText: {
    color: 'white',
  },
  addText: {
    color: Colors.MainColor,
  },
  buttontext: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});