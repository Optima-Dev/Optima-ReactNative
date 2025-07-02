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
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import MainHeader from "../UI/MainHeader";
import AuthForm from "./AuthForm";
import PrimaryButton from "../UI/PrimaryButton";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../store/AuthContext";
import { getUser } from "../../util/UserHttp";
import { useUser } from "../../store/UserContext";
import { login, signup } from "../../util/AuthHttp";
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
    });

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
      setNewUser(true);

      const userData = await getUser(response.token);
      setUser(userData.user);
    } catch (error) {
      console.error(
        `Error during ${type}:`,
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Could not ${type}. Please check your credentials or network connection.`;
      Alert.alert(
        `${type.charAt(0).toUpperCase() + type.slice(1)} Failed`,
        errorMessage
      );

      if (type === "login") {
        setIsError({ email: errorMessage, password: errorMessage });
      } else {
        setIsError({ email: errorMessage });
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

    const hasErrors = Object.values(errorsList).some((value) => !!value);

    if (hasErrors) {
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

  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        style={styles.screen}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
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
                textColor="white"
                isLoading={isLoading}
                disabled={isLoading}
              />
            </View>

            <Pressable
              onPress={swithModeHandler}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.switchButton,
                isLoading && styles.disabledButton,
                { opacity: pressed && !isLoading ? 0.6 : 1 },
              ]}
            >
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
    paddingVertical: 30,
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
    marginTop: 20,
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
});

export default AuthContent;
