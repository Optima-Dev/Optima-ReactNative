import React, { useCallback, useRef } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import Colors from "../../constants/Colors";
import SettingsItem from "../../components/Terms/SettingsItem";
import DetailItem from "../../components/Terms/DetailItem";
import { useUser } from "../../store/UserContext";
import ScreenWrapper from "../../components/UI/ScreenWrapper";

const Settings = ({ navigation }) => {
  const { user } = useUser();
  const speechInProgress = useRef(false);
  const isScreenActive = useRef(true);

  // Clear speech queue with timeout
  const clearSpeechQueue = useCallback(async () => {
    if (await Speech.isSpeakingAsync()) {
      console.log("[Settings] Speech active, stopping existing", {
        platform: Platform.OS,
      });
      await Speech.stop();
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("[Settings] Speech queue cleared", { platform: Platform.OS });
    }
  }, []);

  // Welcome message on screen focus
  useFocusEffect(
    useCallback(() => {
      isScreenActive.current = true;
      if (!speechInProgress.current) {
        speechInProgress.current = true;
        console.log("[Settings] Speaking welcome message");
        const name = user?.lastName || "My Friend";
        const welcomeMessage = `You are in Settings.`;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch((err) => {
          console.log("[Settings] Haptics error:", err);
        });
        clearSpeechQueue().then(() => {
          Speech.speak(welcomeMessage, {
            language: "en-US",
            rate: 0.85,
            pitch: 1.0,
            onDone: () => {
              console.log("[Settings] Welcome message done");
              speechInProgress.current = false;
            },
            onError: (err) => {
              console.log("[Settings] Welcome message error:", err);
              speechInProgress.current = false;
            },
          });
        });
      } else {
        console.log(
          "[Settings] Skipped welcome message due to speechInProgress"
        );
      }

      return () => {
        console.log("[Settings] Screen losing focus, cleaning up");
        isScreenActive.current = false;
        speechInProgress.current = false;
        Speech.stop();
      };
    }, [user, clearSpeechQueue])
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.subTitle}>Account</Text>
        <Pressable onPress={() => navigation.navigate("Account")}>
          <SettingsItem
            title={`${user.firstName} ${user.lastName}`}
            subTitle={user.email}
            leftLogo={require("../../assets/Images/ion_person-outline.png")}
            rightLogo={require("../../assets/Images/Forward-Arrow.png")}
          />
        </Pressable>

        <Text style={styles.subTitle}>Settings</Text>
        <Pressable onPress={() => navigation.navigate("Language")}>
          <SettingsItem
            title='Language'
            subTitle='English'
            leftLogo={require("../../assets/Images/hugeicons_globe.png")}
            rightLogo={require("../../assets/Images/Forward-Arrow.png")}
            rowStyle
          />
        </Pressable>

        <Pressable onPress={() => navigation.navigate("VoiceControl")}>
          <SettingsItem
            title='Voice Control'
            leftLogo={require("../../assets/Images/Voice.png")}
            rightLogo={require("../../assets/Images/Forward-Arrow.png")}
            rowStyle
          />
        </Pressable>

        <SettingsItem
          title='Dark Mode'
          leftLogo={require("../../assets/Images/dark-mode.png")}
          rightLogo={require("../../assets/Images/Toggle-off.png")}
          rowStyle
          darkMode
        />

        <View style={styles.termsContainer}>
          <DetailItem
            text='Terms Of Service'
            iconSource={require("../../assets/Images/Forward-Arrow.png")}
            backgroundColor='#D0CFFC'
          />

          <DetailItem
            text='Privacy Policy'
            iconSource={require("../../assets/Images/Forward-Arrow.png")}
            backgroundColor='#D0CFFC'
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 50 : 20,
    backgroundColor: "white",
    gap: 20,
  },
  title: {
    textAlign: "center",
    color: Colors.MainColor,
    fontWeight: "700",
    fontSize: 30,
    marginBottom: 30,
  },
  subTitle: {
    color: Colors.MainColor,
    fontSize: 24,
    fontWeight: "500",
  },
  termsContainer: {
    marginTop: 40,
    gap: 6,
  },
});
