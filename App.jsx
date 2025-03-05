// importing react hooks
import { useContext, useEffect, useState } from "react";

// importing navigation
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

// importing icons
import { Ionicons } from "@expo/vector-icons";

// auth context
import AuthProvider, { AuthContext } from "./store/AuthContext";

// importing constants
import Colors from "./constants/Colors";

// importing screens
import Splash from "@/screens/Splash";
import OnBoarding from "@/screens/OnBoarding";
import PrivacyTerms1 from "@/screens/PrivacyTerms1";
import Start from "@/screens/Start";
import Login from "@/screens/Authentication/Login";
import Signup from "@/screens/Authentication/Signup";
import ForgetPassword from "./screens/Authentication/ForgetPassword";
import Instructions from "./screens/Instructions";

// importing seeker screens
import Support from "./screens/Seeker/Support";
import MyVision from "./screens/Seeker/MyVision";
import MyPeople from "./screens/Seeker/MyPeople";
import SekeerSettings from "./screens/Seeker/Settings";
import VoiceControl from "./screens/Seeker/VoiceControl";

// importing helper screens
import Home from "./screens/Helper/Home";
import Notifications from "./screens/Helper/Notifications";
import Community from "./screens/Helper/Community";
import HelperSettings from "./screens/Helper/Settings";
import Account from "./screens/Account";
import Language from "./screens/Language";

// importing components
import BackButton from "./components/UI/BackButton";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// creating stack navigator
const Stack = createNativeStackNavigator();

// creating bottom tab navigator
const MyTabs = createBottomTabNavigator();

// creating stack navigator function
function UnAuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.MainColor }, // Correct usage
        headerShadowVisible: false, // Remove shadow between content and header
        headerStyle: {
          shadowOpacity: 0, // Remove shadow on iOS
          elevation: 0, // Remove shadow on Android
        },
        headerTitle: "",
        headerTintColor: Colors.MainColor,
      }}>
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
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name='PrivacyTerms1'
        component={PrivacyTerms1}
        options={{
          headerShown: true,
          headerLeft: () => <BackButton />,
        }}
      />

      <Stack.Screen
        name='Login'
        component={Login}
        options={{
          headerShown: true,
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name='Signup'
        component={Signup}
        options={{
          headerShown: true,
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name='ForgetPassword'
        component={ForgetPassword}
        options={{
          headerShown: true,
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack.Navigator>
  );
}

function SekeerTap() {
  return (
    <MyTabs.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors.MainColor,
        headerShown: false,
        tabBarStyle: {
          marginBottom: 10,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          borderRadius: 20,
        },
        tabBarLabel: ({ color }) => (
          <Text style={{ fontSize: 14, color }}>{route.name}</Text>
        ),
      })}>
      <MyTabs.Screen
        name='Support'
        component={Support}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={`videocam${focused ? "" : "-outline"}`}
              size={30}
              color={color}
            />
          ),
        }}
      />

      <MyTabs.Screen
        name='MyVision'
        component={MyVision}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={`camera${focused ? "" : "-outline"}`}
              size={30}
              color={color}
            />
          ),
        }}
      />

      <MyTabs.Screen
        name='MyPeople'
        component={MyPeople}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={`people${focused ? "" : "-outline"}`}
              size={30}
              color={color}
            />
          ),
        }}
      />

      <MyTabs.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={`settings${focused ? "" : "-outline"}`}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </MyTabs.Navigator>
  );
}

function HelperTap() {
  return (
    <MyTabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.MainColor,
        tabBarStyle: {
          marginBottom: 10,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          borderRadius: 20,
        },
        tabBarLabel: ({ color }) => (
          <Text style={{ fontSize: 14, color }}>{route.name}</Text>
        ),
      })}>
      <MyTabs.Screen
        name='Home'
        component={HelperHomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={`home${focused ? "" : "-outline"}`}
              size={28}
              color={color}
            />
          ),
        }}
      />

      <MyTabs.Screen
        name='Notifications'
        component={Notifications}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={`notifications${focused ? "" : "-outline"}`}
              size={28}
              color={color}
            />
          ),
        }}
      />

      <MyTabs.Screen
        name='Community'
        component={Community}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={`people${focused ? "" : "-outline"}`}
              size={28}
              color={color}
            />
          ),
        }}
      />

      <MyTabs.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={`settings${focused ? "" : "-outline"}`}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </MyTabs.Navigator>
  );
}

function SettingsScreen() {
  const { role } = useContext(AuthContext);
  const Settings = role === "helper" ? HelperSettings : SekeerSettings;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Settings' component={Settings} />
      <Stack.Screen name='Account' component={Account} />
      <Stack.Screen name='ForgetPassword' component={ForgetPassword} />
      <Stack.Screen name='Language' component={Language} />
      <Stack.Screen name='VoiceControl' component={VoiceControl} />
    </Stack.Navigator>
  );
}

function HelperHomeScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='Instructions' component={Instructions} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const { isAuthenticated, role } = useContext(AuthContext);
  const MyTab = role === "helper" ? <HelperTap /> : <SekeerTap />;

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <SafeAreaView style={styles.safeAreaScreen}>{MyTab}</SafeAreaView>
      ) : (
        <UnAuthStack />
      )}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const { authenticate, handleRole } = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");
      const storedRole = await AsyncStorage.getItem("role");

      if (storedToken) {
        authenticate(storedToken);
      }

      if (storedRole) {
        handleRole(storedRole);
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return <AppLoading />;
  }

  return <Navigation />;
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaScreen: {
    flex: 1,
  },
  backTitle: {
    fontSize: 18, // Larger font size
    color: "red", // Red text color
    fontWeight: "bold", // Bold text
  },
});
