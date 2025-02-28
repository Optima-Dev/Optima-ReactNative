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
import { validateEmail, validateName, validatePassword } from "../../util/Validation";

function AuthContent({ type }) {
  const navigation = useNavigation();

  const { authenticate, role } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  async function handleAuth() {
    setIsLoading(true);
    try {
      validateEmail(form.email);
      validatePassword(form.password);

      if (type === "login") {
        const response = await login(form.email.toLowerCase(), form.password, role);
        authenticate(response.token);
      } else {
        validateName(form.firstName);
        validateName(form.lastName);

        const response = await signup(
          form.firstName,
          form.lastName,
          form.email.toLowerCase(),
          form.password,
          role
        );
        authenticate(response.token);
      }
    } catch (error) {
      console.log("error", error);
      Alert.alert("Authentication Failed", error);
    }
    setIsLoading(false);
  }

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
            login={type === "login"}
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
              isLoading={isLoading}
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
