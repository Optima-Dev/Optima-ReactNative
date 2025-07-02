import { Platform, StyleSheet, Text, View } from "react-native";
import MyPeopleContent from "../../components/seeker/MyPeople/MyPeopleContent";
import Colors from "../../constants/Colors";
import ScreenWrapper from "../../components/UI/ScreenWrapper";

const MyPeople = () => {
  return (
    <ScreenWrapper>
    <View style={styles.container}>
      <MyPeopleContent />
    </View>
    </ScreenWrapper>
  );
};

export default MyPeople;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
