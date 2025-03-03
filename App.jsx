// importing react hooks
import { useContext, useEffect, useState } from "react";

// importing navigation
import { StyleSheet, Text } from "react-native";
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

// importing helper screens
import Home from "./screens/Helper/Home";
import Notifications from "./screens/Helper/Notifications";
import Community from "./screens/Helper/Community";
import HelperSettings from "./screens/Helper/Settings";

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
          backgroundColor: Colors.SeconderyColor,
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

function AuthenticatedStack() {
  const { role } = useContext(AuthContext);

  const MyTab = role === "helper" ? HelperTap : SekeerTap;

  const { isNewUser } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isNewUser && (
        <Stack.Screen name='Instructions' component={Instructions} />
      )}
      <Stack.Screen name='MainTabs' component={MyTab} />
    </Stack.Navigator>
  );
}

function SekeerTap() {
  const { logout } = useContext(AuthContext);

  const iconSize = 30;

  return (
    <MyTabs.Navigator
      screenOptions={({ route }) => ({
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
        headerRight: () => (
          <Ionicons
            name='log-out'
            size={iconSize}
            color='black'
            onPress={logout}
          />
        ),
        tabBarLabel: ({ color }) => {
          return (
            <Text style={{ fontSize: 12, color, marginTop: 3 }}>
              {route.name}
            </Text>
          );
        },
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          shadowOffset: { height: 0, width: 0 },
          shadowRadius: 0,
          shadowColor: "transparent",
          backgroundColor: Colors.SeconderyColor,
          height: 80,
          paddingTop: 5,
          borderRadius: 20,
          marginHorizontal: 5,
        },
      })}>
      <MyTabs.Screen
        name='Support'
        component={Support}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name='videocam' size={30} color={color} />
          ),
        }}
      />

      <MyTabs.Screen
        name='MyVision'
        component={MyVision}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name='camera-outline' size={30} color={color} />
          ),
        }}
      />

      <MyTabs.Screen
        name='MyPeople'
        component={MyPeople}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name='people' size={30} color={color} />
          ),
        }}
      />

      <MyTabs.Screen
        name='Settings'
        component={SekeerSettings}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name='settings' size={28} color={color} />
          ),
        }}
      />
    </MyTabs.Navigator>
  );
}

function HelperTap() {
  const { logout } = useContext(AuthContext);

  const iconSize = 30;

  return (
    <MyTabs.Navigator
      screenOptions={({ route }) => ({
        // headerShown: false,
        contentStyle: { backgroundColor: Colors.MainColor }, // Correct usage
        headerShadowVisible: false, // Remove shadow between content and header
        headerStyle: {
          shadowOpacity: 0, // Remove shadow on iOS
          elevation: 0, // Remove shadow on Android
          backgroundColor: Colors.SeconderyColor,
        },
        headerTitle: "",
        headerTintColor: Colors.MainColor,
        headerRight: () => (
          <Ionicons
            name='log-out'
            size={iconSize}
            color='black'
            onPress={logout}
          />
        ),
        tabBarLabel: ({ color }) => {
          return (
            <Text style={{ fontSize: 12, color, marginTop: 3 }}>
              {route.name}
            </Text>
          );
        },
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          shadowOffset: { height: 0, width: 0 },
          shadowRadius: 0,
          shadowColor: "transparent",
          backgroundColor: Colors.SeconderyColor,
          height: 80,
          paddingTop: 5,
          borderRadius: 20,
          marginHorizontal: 5,
        },
      })}>
      <MyTabs.Screen
        name='Home'
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name='videocam' size={iconSize} color={color} />
          ),
        }}
      />

      <MyTabs.Screen
        name='Notifications'
        component={Notifications}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name='camera-outline' size={iconSize} color={color} />
          ),
        }}
      />

      <MyTabs.Screen
        name='Community'
        component={Community}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name='people' size={iconSize} color={color} />
          ),
        }}
      />

      <MyTabs.Screen
        name='Settings'
        component={HelperSettings}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name='settings' size={iconSize} color={color} />
          ),
        }}
      />
    </MyTabs.Navigator>
  );
}

function Navigation() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthenticatedStack /> : <UnAuthStack />}
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
  backTitle: {
    fontSize: 18, // Larger font size
    color: "red", // Red text color
    fontWeight: "bold", // Bold text
  },
});
