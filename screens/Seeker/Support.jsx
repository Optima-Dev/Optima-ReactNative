import { StyleSheet, Text, View, Platform } from "react-native";
import CallButton from "../../components/seeker/CallButton";
import Colors from "../../constants/Colors";
import ArrowButton from "../../components/UI/ArrowButton";
import { useEffect } from "react";

const Support = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.TitleContainer}>
        <Text style={styles.title}>Optima</Text>
      </View>
      <CallButton onPress={() => console.log("Calling support")} />
      <ArrowButton
        text={"MY VISION"}
        type={"MyVision"}
        onPress={() => navigation.navigate("MyVision")}
      />
      <ArrowButton
        text={"MY PEOPLE"}
        type={"MyPeople"}
        onPress={() => navigation.navigate("MyPeople")}
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
    paddingHorizontal: Platform.OS === "ios" ? 20 : null,
    padding: Platform.OS === "ios" ? null : 20,
    justifyContent: Platform.OS === "ios" ? null : "center",
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
    fontSize: Platform.OS === "ios" ? 18 : 13,
    color: "#616161",
    fontWeight: "300",
    textAlign: "center",
    marginVertical: Platform.OS === "ios" ? 10 : 0,
  },
});
