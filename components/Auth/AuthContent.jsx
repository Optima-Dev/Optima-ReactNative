import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// 1. Import Google Auth and WebBrowser
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

import MainHeader from "../UI/MainHeader";
import AuthForm from "./AuthForm";
import PrimaryButton from "../UI/PrimaryButton";
import GoogleButton from "../UI/GoogleButton";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../store/AuthContext";
import { getUser } from "../../util/UserHttp";
import { useUser } from "../../store/UserContext";
// 2. Import your GoogleLogin function
import { login, signup, GoogleLogin } from "../../util/AuthHttp";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../util/Validation";

// This is required for the Google Auth flow to work correctly
WebBrowser.maybeCompleteAuthSession();

function AuthContent({ type }) {
  const navigation = useNavigation();
  const { authenticate, role, setNewUser } = React.useContext(AuthContext);
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isError, setIsError] = useState({
    email: null,
    password: null,
    firstName: null,
    lastName: null,
  });

  // 3. Setup the Google Auth Request Hook
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Replace these with the actual IDs you got from Google Cloud Console
    iosClientId:
      "680106169592-7qu4n3pe06tlv9aca16554vuhbaltvj2.apps.googleusercontent.com",
    androidClientId:
      "680106169592-3hdne4t1vkbd6j13r2rupnuj1mbjj0ki.apps.googleusercontent.com",
    expoClientId:
      "680106169592-ma692m9jk89d16d49uacflfn7sr46ji1.apps.googleusercontent.com",
  });

  // 4. Create a useEffect to handle the response from Google
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      // Call a function to handle the token and get user info
      handleGoogleSignIn(authentication.accessToken);
    } else if (response?.type === "error") {
      Alert.alert(
        "Authentication Failed",
        "Could not sign in with Google. Please try again."
      );
      console.error("Google Auth Error:", response.error);
    }
  }, [response]);

  // 5. Create a function to process the Google sign-in
  async function handleGoogleSignIn(accessToken) {
    setIsLoading(true);
    try {
      // Get user profile info from Google
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const userInfo = await userInfoResponse.json();

      // Call your backend with the user's Google info
      const backendResponse = await GoogleLogin(
        userInfo.id,
        userInfo.email,
        userInfo.given_name,
        userInfo.family_name,
        role
      );

      // Authenticate the user in your app
      authenticate(backendResponse.token);
      setNewUser(false); // Google users are never "new" in terms of needing instructions
      const userData = await getUser(backendResponse.token);
      setUser(userData.user);
    } catch (error) {
      Alert.alert(
        "Google Sign-In Failed",
        error.message || "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // --- Standard Form Handling ---
  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear specific error when user types
    if (isError[key]) {
      setIsError((prev) => ({ ...prev, [key]: null }));
    }
  }

  async function sendingForm() {
    setIsLoading(true);
    setIsError({
      email: null,
      password: null,
      firstName: null,
      lastName: null,
    }); // Clear previous errors

    try {
      let response;

      if (type === "login") {
        response = await login(
          form.email.toLowerCase().trim(),
          form.password,
          role
        );
      } else {
        response = await signup(
          form.firstName.trim(),
          form.lastName.trim(),
          form.email.toLowerCase().trim(),
          form.password,
          role
        );
      }

      authenticate(response.token);
      setNewUser(true); // Assume new user after signup, maybe adjust based on API

      const userData = await getUser(response.token);
      setUser(userData.user);
      // Navigation should happen via context state change listener elsewhere
    } catch (error) {
      console.error(
        `Error during ${type}:`,
        error.response?.data || error.message
      ); // Log detailed error
      // Attempt to parse backend error message if available
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Could not ${type}. Please check your credentials or network connection.`;
      Alert.alert(
        `${type.charAt(0).toUpperCase() + type.slice(1)} Failed`,
        errorMessage
      );

      // Set specific errors if possible, otherwise show general alert
      if (type === "login") {
        // Assuming backend might return specific field errors, otherwise set general
        setIsError({ email: errorMessage, password: errorMessage });
      } else {
        // Assuming backend might return specific field errors, otherwise set general
        setIsError({ email: errorMessage }); // Or distribute error based on backend response
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFormSubmission() {
    let errorsList = {
      email: null,
      password: null,
      firstName: null,
      lastName: null,
    };
    errorsList.email = validateEmail(form.email);
    errorsList.password = validatePassword(form.password);

    if (type === "signup") {
      errorsList.firstName = validateName(form.firstName);
      errorsList.lastName = validateName(form.lastName);
    }

    // Filter out null/false values to check if any error exists
    const hasErrors = Object.values(errorsList).some((value) => !!value);

    if (hasErrors) {
      setIsError(errorsList);
    } else {
      await sendingForm(); // Call sendingForm only if validation passes
    }
  }

  const swithModeHandler = () => {
    if (type === "login") {
      navigation.replace("Signup");
    } else {
      navigation.replace("Login");
    }
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.screen}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps='handled'>
          <View style={styles.container}>
            <MainHeader
              title={
                type === "login"
                  ? `WELCOME\nBACK, FRIEND!`
                  : `LET’S GET\nSTARTED, FRIEND!`
              }
              subtitle={
                type === "login"
                  ? "Login now to continue your past experience with us!"
                  : "Create an account to have a full experience with us!"
              }
              login={type === "login"}
            />
            <AuthForm
              type={type}
              form={form}
              onChange={handleChange}
              errors={isError}
            />
            <View style={styles.ButtonContainer}>
              <PrimaryButton
                backgroundColor={Colors.MainColor}
                title={type === "login" ? "Login" : "Sign up"}
                onPress={handleFormSubmission}
                textColor='white'
                isLoading={isLoading}
                disabled={isLoading}
              />

              <View style={styles.optionContainer}>
                <Text style={styles.optionText}>or continue with</Text>
              </View>

              {/* 6. Add the Google Sign-In button */}
              <GoogleButton
                onPress={() => promptAsync()}
                disabled={!request || isLoading}
              />
            </View>
            <Pressable
              onPress={swithModeHandler}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.switchButton,
                isLoading && styles.disabledButton,
                { opacity: pressed && !isLoading ? 0.6 : 1 },
              ]}>
              <View style={styles.textContainer}>
                <Text style={styles.normalText}>
                  {type === "login"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                </Text>
                <Text style={styles.linkText}>
                  {type === "login" ? "Sign Up" : "Login"}
                </Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  ButtonContainer: {
    width: "100%",
    maxWidth: 364,
    marginBottom: 10,
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  normalText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "300",
  },
  linkText: {
    fontSize: 16,
    color: Colors.MainColor,
    fontWeight: "600",
  },
  switchButton: {
    padding: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  optionContainer: {
    marginVertical: 5, // Adjusted margin
  },
  optionText: {
    fontSize: 16,
    color: "#555", // Slightly lighter color
    textAlign: "center",
    fontWeight: "300",
  },
});

export default AuthContent;
