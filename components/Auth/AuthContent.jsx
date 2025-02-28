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
import { useContext, useState, useEffect } from "react";
import AuthHeader from "./AuthHeader";
import AuthForm from "./AuthForm";
import PrimaryButton from "../UI/PrimaryButton";
import GoogleButton from "../UI/GoogleButton";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../store/AuthContext";
import { login, signup, GoogleLogin } from "../../util/HttpAuth";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

function AuthContent({ type }) {
  const navigation = useNavigation();
  const { authenticate, role, token } = useContext(AuthContext);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const GOOGLE_CLIENT_ID =
    "1055266290918-lj07ug350vv502i04pj11m587ro4mahn.apps.googleusercontent.com";

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_CLIENT_ID,
  });

  // Handle Google Auth Response
  useEffect(() => {
    if (response?.type === "success") {
      const getUserInfo = async () => {
        try {
          const { authentication } = response;
          const userInfoResponse = await fetch(
            "https://www.googleapis.com/userinfo/v2/me",
            {
              headers: {
                Authorization: `Bearer ${authentication.accessToken}`,
              },
            }
          );
          const userInfo = await userInfoResponse.json();

          // Call your backend API with Google data
          const googleLoginResponse = await GoogleLogin(
            userInfo.id, // Google ID
            userInfo.email,
            userInfo.given_name, // First Name
            userInfo.family_name, // Last Name
            role
          );

          // Authenticate the user in your app
          authenticate(googleLoginResponse.token);
        } catch (error) {
          Alert.alert("Google Login Failed", error.message);
        }
      };
      getUserInfo();
    }
  }, [response]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAuth = async () => {
    try {
      if (type === "login") {
        const response = await login(form.email, form.password, role);
        authenticate(response.token);
      } else {
        const response = await signup(
          form.firstName,
          form.lastName,
          form.email,
          form.password,
          role
        );
        authenticate(response.token);
      }
    } catch (error) {
      Alert.alert("Authentication Failed", error);
    }
  };

  const swithModeHandler = () => {
    if (type === "login") {
      navigation.replace("Signup");
    } else {
      navigation.replace("Login");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}>
      <ScrollView style={styles.screen} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Auth Header */}
          <AuthHeader
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
            TitleStyle={{ width: 350, marginStart: 65 }}
            SubtitleStyle={{ width: 350, marginStart: 35 }}
          />

          {/* Auth Form */}
          <AuthForm type={type} form={form} onChange={handleChange} />

          {/* Confirm Button */}
          <View style={styles.ButtonContainer}>
            <PrimaryButton
              backgroundColor={Colors.MainColor}
              title={type === "login" ? "Login" : "Sign up"}
              onPress={handleAuth}
              textColor='white'
            />
          </View>

          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>or continue with</Text>
          </View>

          {/* Google Button */}
          <GoogleButton onPress={promptAsync} />

          {/* Switch Button */}
          <Pressable
            onPress={swithModeHandler}
            style={({ pressed }) => [
              styles.switchButton,
              { opacity: pressed ? 0.6 : 1 },
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  ButtonContainer: {
    width: Platform.OS === "android" ? 350 : 364,
    marginBottom: 10,
  },
  optionContainer: {
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    fontWeight: "300",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  normalText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "300",
  },
  linkText: {
    fontSize: 16,
    color: Colors.MainColor,
    fontWeight: 600,
  },
});

export default AuthContent;
