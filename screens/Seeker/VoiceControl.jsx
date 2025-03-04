import { StyleSheet, Text, View, ScrollView, Platform } from "react-native";
import BackButton from "../../components/UI/BackButton";
import Colors from "../../constants/Colors";

const VOICE_CONTROL = {
  "Nav Bar": [
    `"Open Support"`,
    `"Open My Vision"`,
    `"Open My People"`,
    `"Open Settings"`,
  ],
  Support: [`"Call A Volunteer"`, `"Open My Vision"`, `"Open My People"`],
  "Call A Volunteer": [`"End Call"`, `"Flip Camera"`],
  Report: [`"Report Call"`, `"No, Thank You"`],
  "My Vision": [`"Take A Picture"`, `"Repeat"`],
  "My People": [`"Call PERSON'S NAME"`],
};

const VoiceControl = () => {
  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Voice Control</Text>
      <Text style={styles.subTitle}>
        We preferer to use your native language as main language to make it
        easier for us to assign you with people with the same native language as
        yours.
      </Text>

      <ScrollView style={styles.VoiceControlContainer}>
        {Object.keys(VOICE_CONTROL).map((key, index) => (
          <View key={index}>
            <Text style={styles.VoiceControlTitle}>{key}</Text>
            {VOICE_CONTROL[key].map((item, index) => (
              <Text
                key={index}
                style={[
                  styles.VoiceControlSubtitle,
                  index !== VOICE_CONTROL[key].length - 1 &&
                    styles.borderBottom,
                ]}>
                {item}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default VoiceControl;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  title: {
    fontSize: 38,
    fontWeight: "700",
    color: Colors.MainColor,
    textAlign: "center",
  },
  subTitle: {
    color: "#50555C",
    fontSize: 20,
    fontWeight: "300",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 28,
  },
  VoiceControlContainer: {
    marginTop: 20,
  },
  VoiceControlTitle: {
    color: "#50555C",
    fontSize: 20,
    fontWeight: "600",
    paddingVertical: 10,
  },
  VoiceControlSubtitle: {
    color: Colors.black,
    fontWeight: 500,
    fontSize: 20,
    padding: 8,
    marginHorizontal: 20,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#CBCBCB",
  },
});
