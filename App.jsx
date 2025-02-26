// importing navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform, StyleSheet } from "react-native";

// importing constants
import Colors from "./constants/Colors";

// importing icons
import { Ionicons } from "@expo/vector-icons";

// importing screens
import Splash from "@/screens/Splash";
import OnBoarding from "@/screens/OnBoarding";
import PrivacyTerms1 from "@/screens/PrivacyTerms1";
import Start from "@/screens/Start";
import Login from "@/screens/Authentication/Login";
import Signup from "@/screens/Authentication/Signup";
import ForgetPassword1 from "./screens/Authentication/ForgetPassword1";

// importing components
import BackButton from "./components/UI/BackButton";


// creating stack navigator
const Stack = createNativeStackNavigator();

// creating stack navigator function
function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.MainColor }, // Correct usage
        headerShadowVisible: false, // Remove shadow between content and header
        headerStyle: {
          shadowOpacity: 0, // Remove shadow on iOS
          elevation: 0, // Remove shadow on Android
          backgroundColor: Colors.SeconderyColor,
        },
        headerTitle: "",
        headerTintColor: Colors.MainColor,
      }}
    >
      <Stack.Screen
        name='Splash'
        component={Splash}
        options={{
          headerShown: false,
          gestureEnabled: false, // Disable going back to Splash
        }}
      />

      <Stack.Screen name='OnBoarding1' component={OnBoarding} />

      <Stack.Screen
        name='Start'
        component={Start}
        options={{
          headerShown: true,
          headerLeft: () => Platform.OS === "android" ? <BackButton /> : null,
        }}
      />
      <Stack.Screen
        name='PrivacyTerms1'
        component={PrivacyTerms1}
        options={{
          headerShown: true,
          headerLeft: () => Platform.OS === "android" ? <BackButton /> : null,
        }}
      />

      <Stack.Screen
        name='Login'
        component={Login}
        options={{
          headerShown: true,
          headerLeft: () => Platform.OS === "android" ? <BackButton /> : null,
        }}
      />
      <Stack.Screen
        name='Signup'
        component={Signup}
        options={{
          headerShown: true,
          headerLeft: () => Platform.OS === "android" ? <BackButton /> : null,
        }}
      />
      <Stack.Screen
        name='ForgetPassword1'
        component={ForgetPassword1}
        options={{
          headerShown: true,
          headerLeft: () => Platform.OS === "android" ? <BackButton /> : null,
        }}
      />

    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  backTitle: {
    fontSize: 18, // Larger font size
    color: 'red', // Red text color
    fontWeight: 'bold', // Bold text
  },
});