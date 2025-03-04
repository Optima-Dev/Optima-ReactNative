import { StyleSheet, Text, View, Platform } from "react-native";
import CallButton from "../../components/seeker/CallButton";
import Colors from "../../constants/Colors";
import ArrowButton from "../../components/UI/ArrowButton";
import { useNavigation } from "@react-navigation/native";
const Support = () => {
  const Navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.TitleContainer}>
        <Text style={styles.title}>Optima</Text>
      </View>
      <CallButton onPress={() => console.log("Calling support")} />
      <ArrowButton
        text={"MY VISION"}
        type={"MyVision"}
        onPress={() => Navigation.navigate("MyVision")}
      />
      <ArrowButton
        text={"MY PEOPLE"}
        type={"MyPeople"}
        onPress={() => Navigation.navigate("MyPeople")}
      />
      <Text style={styles.regularText}>
        You can use your voice to control the whole app.
      </Text>
    </View>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  TitleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: Platform.OS === "ios" ? 32 : 28,
    color: Colors.MainColor,
    fontWeight: "400",
    fontFamily: "Balgin-Regular",
  },
  regularText: {
    fontSize: 13,
    color: "#616161",
    // fontWeight: "300",
    textAlign: "center",
  },
});
