// importing react hooks
import { useState } from "react";

// importing react-native components
import { Alert, StyleSheet, Text, View } from "react-native";

// importing constants
import Colors from "@/constants/Colors";

// importing components
import ForgetPassHeader from "@/components/Auth/ForgetPassHeader";
import AuthInput from "@/components/Auth/AuthInput";
import PrimaryButton from "@/components/UI/PrimaryButton";
import CodeInput from "@/components/Auth/CodeInput";
import { sendingCode, resetPassword, verifyCode } from "@/util/HttpAuth";


const content = [
  {
    title: "Password Reset",
    subTitle: "Enter your email to get a verification code to reset your password",
    buttonText: "Send Code",
  },
  {
    title: "Enter The code",
    subTitle: "Check your email and enter the code was sent for you",
    buttonText: "Verify",
  },
  {
    title: "Reset Your Password",
    subTitle: "Please enter your new password",
    buttonText: "Reset",
  }
];

const ForgetPassword = ({ navigation }) => {

  const [inputText, setInputText] = useState({
    email: "",
    newPassword: "",
  });
  const [phases, setPhases] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);


  function handleInputChange(value) {
    const field = phases === 1 ? "email" : "newPassword";
    setInputText((prev) => ({
      ...prev,
      [field]: value.toLowerCase(),
    }));
  }

  function handleCodeChange(value, index) {
    setVerificationCode((prev) => {
      let newCode = [...prev];
      newCode[index] = value;
      return newCode;
    });
  }

  async function sendCodeAgain() {
    setIsLoading(true);
    try {
      const response = await sendingCode(inputText.email.toLowerCase());
      Alert.alert("Success", response);
    } catch(error) {
      Alert.alert("Error", error);
    }
    setIsLoading(false);
  }

  async function handleSumbit() {
    setIsLoading(true);
    try {
      let response;

      if(phases === 1) {
        response = await sendingCode(inputText.email);
        setPhases(prev => prev + 1);
      }
      else if(phases === 2){
        response = await verifyCode(inputText.email, verificationCode.join(""));
        setPhases(prev => prev + 1);
      } else {
        response = await resetPassword(inputText.email, inputText.newPassword);
        navigation.navigate("Login");
      }

      Alert.alert("Success", response);
    } catch(error) {
      Alert.alert("Error", error);
    }
    setIsLoading(false);
  }

  return (
    <View style={styles.container}>
      
      <ForgetPassHeader
        title={content[phases - 1].title}
        subTitle={content[phases - 1].subTitle}
      />

      {
        phases === 2 ? (
          <CodeInput
            verificationCode={verificationCode}
            handleCodeChange={handleCodeChange}
          />
        ) : (
          <AuthInput
            icon={ phases === 1 ? "mail-outline" : "lock-closed-outline"}
            placeholder={ phases === 1 ? "example@gmail.com" : "********" }
            secureTextEntry={ phases === 3 }
            value={ phases === 1 ? inputText.email : inputText.newPassword }
            onChangeText={handleInputChange}
          />
        )
      }

      {
        phases === 3 && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.insetructionText}>Your password must include: </Text>
            <Text style={styles.insetructionText}>At least 8 charachters</Text>
            <Text style={styles.insetructionText}>At least one Number and one symbol</Text>
          </View>
        )
      }

      <PrimaryButton
        title={content[phases - 1].buttonText}
        backgroundColor={Colors.MainColor}
        onPress={handleSumbit}
        textColor="white"
        isLoading={isLoading}
      />

      { phases === 2 && (
        <PrimaryButton
          title="Send Again"
          backgroundColor='white'
          onPress={sendCodeAgain}
          textColor={Colors.MainColor}
          isLoading={isLoading}
        />
      )}

    </View>
  );
}

export default ForgetPassword;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    rowGap: 20,
    backgroundColor: Colors.SeconderyColor,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  instructionsContainer: {
    paddingLeft: 10,
    marginRight: 'auto',
    gap: 5,
  },
  insetructionText: {
    color: Colors.grey400,
    fontSize: 18,
    fontWeight: 500,
  }
});