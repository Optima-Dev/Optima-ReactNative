import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/Colors";
import BackButton from "../components/UI/BackButton";
import SearchInput from "../components/UI/SearchInput";

const LANGAUGES = [
  {
    id: 1,
    name: "English",
    name2: "(English)",
  },
  {
    id: 2,
    name: "العربية",
    name2: "(Arabic)",
  },
  {
    id: 3,
    name: "Español",
    name2: "(Spanish)",
  },
  {
    id: 4,
    name: "Deutsch",
    name2: "(German)",
  },
  {
    id: 5,
    name: "Français",
    name2: "(French)",
  },
];

const Language = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={false}>
        <View style={styles.container}>
          <BackButton />

          <Text style={styles.title}>Language</Text>
          <SearchInput />

          <Text style={styles.subTitle}>
            We preferer to use your native language as main language to make it
            easier for us to assign you with people with the same native
            language as yours.
          </Text>

          <ScrollView style={styles.languagesContainer}>
            <View>
              {LANGAUGES.map((lang) => (
                <View
                  key={lang.id}
                  style={[
                    styles.languageContainer,
                    lang.id !== 5 && styles.applyBorder,
                  ]}>
                  <Text style={styles.languageText}>{lang.name}</Text>
                  <Text style={styles.languageText2}>{lang.name2}</Text>
                  {lang.id === 1 && (
                    <Ionicons
                      name='checkmark-sharp'
                      size={24}
                      color={Colors.MainColor}
                      style={styles.activeMark}
                    />
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Language;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  title: {
    textAlign: "center",
    color: Colors.MainColor,
    fontWeight: "700",
    fontSize: 30,
    marginBottom: 30,
  },
  subTitle: {
    color: "#50555C",
    fontSize: 20,
    fontWeight: "300",
    marginTop: 20,
    textAlign: "center",
    lineHeight: 28,
  },
  languagesContainer: {
    borderRadius: 20,
    backgroundColor: Colors.SeconderyColor,
    marginTop: 20,
    padding: 10,
    height: 400,
  },
  languageContainer: {
    gap: 10,
    padding: 10,
    justifyContent: "center",
  },
  applyBorder: {
    borderBottomColor: "#CBCBCB",
    borderBottomWidth: 1,
  },
  languageText: {
    color: Colors.black,
    fontSize: 20,
    fontWeight: "500",
  },
  languageText2: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: "300",
  },
  activeMark: {
    position: "absolute",
    right: 10,
  },
});
