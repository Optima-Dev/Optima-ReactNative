import { useState, useEffect } from "react";
import { View, StyleSheet, Platform, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import HelpIcon from "./HelpIcon";
import PrimaryButton from "../../UI/PrimaryButton";
import Colors from "../../../constants/Colors";
import { useAuth } from "../../../store/AuthContext";

function HelpRequests() {
  const [isAskingForHelp, setIsAskingForHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  async function handleAcceptCall() {
    navigation.navigate("CallScreen");
  }

  return (
    <View style={styles.container}>
      <View style={styles.askForHelpIcon}>
        <HelpIcon isAskingForHelp={isAskingForHelp} />
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={isLoading ? "Connecting..." : "Accept The Call"}
          backgroundColor={isAskingForHelp ? Colors.MainColor : Colors.grey400}
          textColor={"white"}
          disabled={!isAskingForHelp || isLoading || meetingLoading}
          onPress={handleAcceptCall}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: Platform.OS === "ios" ? 68 : null,
  },
  askForHelpIcon: {
    flex: Platform.OS === "ios" ? 1 : null,
  },
  buttonContainer: {
    marginTop: Platform.OS === "ios" ? null : 80,
    zIndex: 2,
  },
});

export default HelpRequests;
