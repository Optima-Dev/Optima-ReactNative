import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Google Sign-in imports commented out
// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";

// Import your components and utils
import MainHeader from "../UI/MainHeader";
import AuthForm from "./AuthForm";
import PrimaryButton from "../UI/PrimaryButton";
// import GoogleButton from "../UI/GoogleButton"; // Google button temporarily disabled
import Colors from "../../constants/Colors";
import { AuthContext } from "../../store/AuthContext";
import { getUser } from "../../util/UserHttp";
import { useUser } from "../../store/UserContext";
import { login, signup, GoogleLogin } from "../../util/AuthHttp"; // Ensure GoogleLogin exists and is correctly implemented
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../util/Validation";

// Necessary for expo-auth-session
// WebBrowser.maybeCompleteAuthSession();

function AuthContent({ type }) {
  const navigation = useNavigation();
  const { authenticate, role, setNewUser } = useContext(AuthContext); // Get role from context
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  // const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Loading state for Google Sign-In

  // State for standard form
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

  // --- Google Sign-In Hook ---
  // Initialize Google Sign-In Hook with actual client ID
  /*
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID", // Replace with your actual client ID
    expoClientId: "YOUR_EXPO_CLIENT_ID", // Replace with your actual client ID
    webClientId: "YOUR_WEB_CLIENT_ID", // Replace with your actual client ID
  });

  // --- Effect to handle Google Sign-In response ---
  useEffect(() => {
    if (response?.type === "success") {
      setIsGoogleLoading(true); // Start loading indicator for backend call
      const { authentication } = response;
      // console.log("Google Auth Response:", authentication); // For debugging

      // Get user info from Google
      fetchUserInfo(authentication.accessToken);
    } else if (response?.type === "error") {
      console.error("Google Authentication Error:", response.error);
      Alert.alert(
        "Authentication Failed",
        "Could not sign in with Google. Please try again."
      );
      setIsGoogleLoading(false);
    } else if (response?.type === "cancel") {
      // User cancelled the login flow
      console.log("Google Authentication Cancelled");
      setIsGoogleLoading(false);
    }
  }, [response]);

  // --- Function to fetch user info from Google API ---
  async function fetchUserInfo(token) {
    try {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userInfo = await userInfoResponse.json();
      // console.log("Google User Info:", userInfo); // For debugging

      if (!userInfo.id || !userInfo.email || !userInfo.given_name || !userInfo.family_name) {
          throw new Error("Incomplete user information received from Google.");
      }

      // --- Call your backend API for Google Login/Signup ---
      // Ensure the 'role' is correctly determined (using context here)
      if (!role) {
           Alert.alert("Role Error", "User role is not defined. Cannot complete Google Sign-In.");
           setIsGoogleLoading(false);
           return;
      }

      const backendResponse = await GoogleLogin({
        googleId: userInfo.id,
        email: userInfo.email,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        role: role, // Pass the role determined by your app's logic
      });

      // --- Handle backend response ---
      authenticate(backendResponse.token);
      setNewUser(true); // Or determine if new based on backend response if available

      const userData = await getUser(backendResponse.token);
      setUser(userData.user);
      // Navigation will likely happen automatically due to context changes

    } catch (error) {
      console.error("Error fetching user info or calling backend:", error);
      Alert.alert(
        "Login Error",
        error.message || "An error occurred during Google Sign-In. Please try again."
      );
    } finally {
      setIsGoogleLoading(false); // Stop loading indicator
    }
  }
  */

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

  // --- Google Button Press Handler ---
  const handleGoogleSignIn = () => {
    Alert.alert("Feature Unavailable", "Google Sign-in is currently disabled.");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollViewContent} // Use contentContainerStyle for ScrollView content
        keyboardShouldPersistTaps='handled' // Dismiss keyboard on tap outside inputs
      >
        <View style={styles.container}>
          {/* Auth Header */}
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

          {/* Auth Form */}
          <AuthForm
            type={type}
            form={form}
            onChange={handleChange}
            errors={isError} // Pass down error state
          />

          {/* Confirm Button */}
          <View style={styles.ButtonContainer}>
            <PrimaryButton
              backgroundColor={Colors.MainColor}
              title={type === "login" ? "Login" : "Sign up"}
              onPress={handleFormSubmission}
              textColor='white'
              isLoading={isLoading} // Use standard loading state
              disabled={isLoading} // Disable if any loading is active
            />
          </View>

          {/* Google Sign-in temporarily disabled */}
          {/* <View style={styles.optionContainer}>
            <Text style={styles.optionText}>or continue with</Text>
          </View>
          <GoogleButton
            onPress={handleGoogleSignIn}
            disabled={true}
          /> */}

          {/* Switch Button */}
          <Pressable
            onPress={swithModeHandler}
            disabled={isLoading} // Disable if any loading is active
            style={({ pressed }) => [
              styles.switchButton,
              isLoading && styles.disabledButton, // Optional: style when disabled
              { opacity: pressed && !isLoading ? 0.6 : 1 }, // Only change opacity if not disabled
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
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1, // Ensures content can grow to fill space, important for centering
    justifyContent: "center", // Center content vertically
  },
  container: {
    // flex: 1, // Removed flex: 1 here, let ScrollView handle growth
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, // Use horizontal padding
    paddingVertical: 30, // Add vertical padding
    // marginBottom: 30, // Removed, paddingVertical handles spacing
  },
  ButtonContainer: {
    width: "100%", // Make button width relative
    maxWidth: 364, // Optional: set a max width for larger screens
    marginBottom: 10,
    alignItems: "center", // Center button if maxWidth is used
  },
  optionContainer: {
    marginVertical: 15, // Adjusted margin
  },
  optionText: {
    fontSize: 16,
    color: "#555", // Slightly lighter color
    textAlign: "center",
    fontWeight: "300",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20, // Increased margin
  },
  normalText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "300",
  },
  linkText: {
    fontSize: 16,
    color: Colors.MainColor,
    fontWeight: "600", // Bolder link
  },
  switchButton: {
    padding: 10, // Add padding to make it easier to press
  },
  disabledButton: {
    // Optional style for disabled state
    opacity: 0.5,
  },
});

export default AuthContent;
