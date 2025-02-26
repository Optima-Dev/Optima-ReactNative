import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import ForgetPassHeader from "../../components/Auth/ForgetPassHeader";
import { useState } from "react";
import AuthInput from "../../components/Auth/AuthInput";
import PrimaryButton from "../../components/UI/PrimaryButton";
import CodeInput from "@/components/Auth/CodeInput";


const ForgetPassword1 = ({ navigation }) => {

  const [inputText, setInputText] = useState('');
  const [phases, setPhases] = useState(1);
  const [code, setCode] = useState(['', '', '', '']);

  function handleNextPhase() {
    setPhases((prev) => prev + 1);
  }

  function handleCodeChange(value, index) {
    setCode((prev) => {
      let newCode = [...prev];
      newCode[index] = value;
      return newCode;
    });
  }

  function handleInputChange(value) {
    setInputText(value);
  }

  function handlePressingPrimaryButton() {
    if(phases < 3){
      handleNextPhase();
    } else {
      navigation.navigate("Login");
    }
  }

  let titleHeader = "Password Reset";
  let subTitle="Enter your email to get a verification code to reset your password";
  let titleButton = "Send Code";

  if(phases === 2){
    titleHeader = "Enter The code";
    subTitle = "Check your email and enter the code was sent for you";
    titleButton = "Verify";
  } else if(phases === 3) {
    titleHeader = "Reset Your Password";
    subTitle = "Please enter your new password";
    titleButton = "Reset";
  }

  return (
    <View style={styles.container}>
      
      <ForgetPassHeader
        title={titleHeader}
        subTitle={subTitle}
      />

      {
        phases === 2 ? (
          <CodeInput
            code={code}
            handleCodeChange={handleCodeChange}
          />
        ) : (
          <AuthInput
            icon={ phases === 1 ? "mail-outline" : "lock-closed-outline"}
            placeholder={phases === 1 ? "example@gmail.com" : "********"}
            secureTextEntry={true}
            value={inputText}
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
        title={titleButton}
        backgroundColor={Colors.MainColor}
        onPress={handlePressingPrimaryButton}
        textColor="white"
      />

      { phases === 2 && (
        <PrimaryButton
          title="Send Again"
          backgroundColor='white'
          onPress={() => {}}
          textColor={Colors.MainColor}
        />
      )}

    </View>
  );
}

export default ForgetPassword1;


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