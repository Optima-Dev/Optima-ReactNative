import { StyleSheet, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../../constants/Colors";

const SearchInput = () => {
  return (
    <View style={styles.inputContainer}>
      <Ionicons name='search' size={28} color={"#8A8A8A"} />
      <TextInput
        placeholder='Search'
        placeholderTextColor='#8A8A8A'
        style={styles.input}
      />
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#F5F6F3",
    borderRadius: 18,
    gap: 10,
    borderWidth: 2,
    borderColor: Colors.MainColor,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
});
