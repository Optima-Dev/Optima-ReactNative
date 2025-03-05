import { View, StyleSheet } from "react-native";
import HelpIcon from "./HelpIcon";
import PrimaryButton from "../../UI/PrimaryButton";
import Colors from "../../../constants/Colors";

function HelpRequests({ isAskingForHelp }) {
  return (
    <View style={styles.container}>
      <View style={styles.askForHelpIcon}>
        <HelpIcon isAskingForHelp={isAskingForHelp} />
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title='Accept The Call'
          backgroundColor={isAskingForHelp ? Colors.MainColor : Colors.grey400}
          textColor={"white"}
          disabled={isAskingForHelp}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  askForHelpIcon: {
    marginTop: 80,
  },
  buttonContainer: {
    marginTop: 80,
    zIndex: 2,
  },
});

export default HelpRequests;
