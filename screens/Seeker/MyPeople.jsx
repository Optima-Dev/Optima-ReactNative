import { StyleSheet, Text, View } from "react-native";
import MyPeopleContent from "../../components/seeker/MyPeople/MyPeopleContent";
import Colors from "../../constants/Colors";

const MyPeople = () => {
  return (
    <View style={styles.container}>
      <MyPeopleContent />
    </View>
  );
};

export default MyPeople;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
});
