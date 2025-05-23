import { useContext, useState } from "react";
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
import MainHeader from "../UI/MainHeader";
import AuthForm from "./AuthForm";
import PrimaryButton from "../UI/PrimaryButton";
import GoogleButton from "../UI/GoogleButton";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../store/AuthContext";
import { getUser } from "../../util/UserHttp";
import { useUser } from "../../store/UserContext";
import { login, signup, GoogleLogin } from "../../util/AuthHttp";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../util/Validation";

function AuthContent({ type }) {
  const navigation = useNavigation();

  const { authenticate, role, setNewUser } = useContext(AuthContext);
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

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function sendingForm() {
    setIsLoading(true);

    try {
      let response;

      if (type === "login") {
        response = await login(form.email.toLowerCase(), form.password, role);
      } else {
        response = await signup(
          form.firstName,
          form.lastName,
          form.email.toLowerCase(),
          form.password,
          role
        );
      }

      authenticate(response.token);
      setNewUser(true);

      const userData = await getUser(response.token);
      setUser(userData.user);
    } catch (error) {
      if (type === "login") {
        setIsError({ email: error, password: error });
      } else {
        setIsError({ email: error });
      }
    }

    setIsLoading(false);
  }

  async function handleFormSubmission() {
    let errorsList = {};
    errorsList.email = validateEmail(form.email);
    errorsList.password = validatePassword(form.password);

    if (type === "signup") {
      errorsList.firstName = validateName(form.firstName);
      errorsList.lastName = validateName(form.lastName);
    }

    if (Object.values(errorsList).some((value) => value)) {
      setIsError(errorsList);
    } else {
      await sendingForm();
    }
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
            errors={isError}
          />

          {/* Confirm Button */}
          <View style={styles.ButtonContainer}>
            <PrimaryButton
              backgroundColor={Colors.MainColor}
              title={type === "login" ? "Login" : "Sign up"}
              onPress={handleFormSubmission}
              textColor='white'
              isLoading={isLoading}
            />
          </View>

          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>or continue with</Text>
          </View>

          {/* Google Button */}
          <GoogleButton />

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
    padding: 20,
    marginBottom: 30,
  },
  ButtonContainer: {
    width: Platform.OS === "android" ? 360 : 364,
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
