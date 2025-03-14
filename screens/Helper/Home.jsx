import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import MainHeader from "../../components/UI/MainHeader";
import DetailItem from "../../components/Terms/DetailItem";
import Colors from "../../constants/Colors";
import { useUser } from "../../store/UserContext";
import FriendsList from "../../components/helper/FriendsList";

const Home = ({ navigation }) => {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <MainHeader
        title={`Hello, ${user.firstName} ${user.lastName}!`}
        subtitle='We would like to thank you for investing your precious time in helping people.'
        imageTitle
      />
      <Image
        source={require("../../assets/Images/Ellipse 1.png")}
        style={[styles.ring2]}
      />
      <Pressable style={styles.buttonContainer}>
        <Text style={styles.buttonText}>
          People who are waiting today for help from all over the world
        </Text>

        <View style={styles.numberContainer}>
          <Image
            source={require("../../assets/Images/Ellipse 10.png")}
            style={styles.ring}
          />
          <Text style={styles.numberText}>200</Text>
        </View>
        <Image
          source={require("../../assets/Images/Ellipse 11.png")}
          style={[styles.ring, { top: 130, left: 0 }]}
        />
      </Pressable>

      <DetailItem
        onPress={() => {
          navigation.navigate("Instructions");
        }}
        text='How to pick-up a call'
        backgroundColor={Colors.green500}
        iconSource={require("../../assets/Images/Forward-Arrow.png")}
      />
      <FriendsList />
      <View style={styles.textContainer}>
        <Text style={styles.bottomText}>
          We will notify you when someone needs help.
        </Text>
        <Image
          source={require("../../assets/Images/Ellipse 2.png")}
          style={[styles.ring2]}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
    gap: 10,
    paddingTop: Platform.OS === "android" ? 60 : 0,
    zIndex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 40,
    backgroundColor: Colors.MainColor,
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 16,
    overflow: "hidden",
    zIndex: 1,
  },
  buttonText: {
    fontWeight: "600",
    color: Colors.white,
    fontSize: 22,
    width: "54%",
    zIndex: 1,
  },
  numberContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 96,
    height: 96,
    backgroundColor: Colors.white,
    borderRadius: 48,
    zIndex: 1,
  },
  numberText: {
    color: Colors.MainColor,
    fontSize: 30,
    fontWeight: "700",
    zIndex: 1,
  },

  textContainer: {
    flex: 1,
    justifyContent: "flex-end",
    zIndex: 1,
  },
  bottomText: {
    color: Colors.black500,
    fontWeight: "300",
    fontSize: 14,
    fontFamily: "SF UI Display",
    textAlign: "center",
    marginBottom: 20,
    zIndex: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  ring: {
    position: "absolute",
    zIndex: -1,
  },
  ring2: {
    position: "absolute",
    zIndex: -1,
  },
});
