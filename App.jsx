// importing react hooks
import React, { useEffect, useState, useMemo } from "react";

// importing navigation
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";

// importing icons
import { Ionicons } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";

// importing constants
import Colors from "./constants/Colors";

// importing screens
import Splash from "@/screens/Splash";
import OnBoarding from "@/screens/OnBoarding";
import PrivacyTerms from "@/screens/PrivacyTerms";
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
import Article from "./screens/Helper/Atricle";

// importing components
import BackButton from "./components/UI/BackButton";

// importing contexts
import AuthProvider, { useAuth } from "./store/AuthContext";
import UserProvider, { useUser } from "./store/UserContext";
import HelperProvider, { useHelper } from "./store/HelperContext";
import SeekerProvider, { useSeeker } from "./store/SeekerContext";

// importing util functions
import { getUser } from "./util/UserHttp";
import { getFriendRequests, getFriends } from "./util/FriendsHttp";

// creating stack navigator
const Stack = createNativeStackNavigator();

// creating bottom tab navigator
const MyTabs = createBottomTabNavigator();

// creating stack navigator function
const UnAuthStack = React.memo(() => (
  <Stack.Navigator
    screenOptions={{
      headerLeft: () => <BackButton />,
      contentStyle: { backgroundColor: Colors.MainColor },
      headerStyle: { shadowOpacity: 0, elevation: 0 },
      headerTintColor: Colors.MainColor,
      headerShadowVisible: false,
      headerTitle: "",
    }}>
    <Stack.Screen
      name='Splash'
      component={Splash}
      options={{
        headerShown: false,
        gestureEnabled: false,
      }}
    />

    <Stack.Screen
      name='OnBoarding1'
      component={OnBoarding}
      options={{ headerShown: false }}
    />

    <Stack.Screen name='Start' component={Start} />
    <Stack.Screen name='PrivacyTerms' component={PrivacyTerms} />
    <Stack.Screen name='Login' component={Login} />
    <Stack.Screen name='Signup' component={Signup} />
    <Stack.Screen name='ForgetPassword' component={ForgetPassword} />
  </Stack.Navigator>
));

const createTabScreen = (name, component, icon, dot) => {
  return (
    <MyTabs.Screen
      name={name}
      component={component}
      options={{
        tabBarIcon: ({ color, focused }) => (
          <>
            <Ionicons
              name={`${icon}${focused ? "" : "-outline"}`}
              size={28}
              color={color}
            />
            {dot && <View style={styles.notificationDot} />}
          </>
        ),
      }}
    />
  );
};

const SeekerTap = React.memo(() => (
  <MyTabs.Navigator
    screenOptions={({ route }) => ({
      tabBarActiveTintColor: Colors.MainColor,
      headerShown: false,
      tabBarStyle: {
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        // marginBottom: Platform.OS === "ios" ? 0 : 12,
        height: Platform.OS === "ios" ? 0 : 60, // it suits the android
      },
      tabBarLabel: ({ color }) => (
        <Text style={{ fontSize: 14, color, paddingBottom: 10 }}>
          {route.name}
        </Text>
      ),
    })}>
    {createTabScreen("Support", Support, "videocam")}
    {createTabScreen("MyVision", MyVision, "camera")}
    {createTabScreen("MyPeople", MyPeople, "people")}
    {createTabScreen("Settings", SettingsScreen, "settings")}
  </MyTabs.Navigator>
));

const HelperTap = React.memo(({ hasRequest }) => (
  <MyTabs.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: Colors.MainColor,
      tabBarStyle: {
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        // marginBottom: Platform.OS === "ios" ? 0 : 12,
        height: Platform.OS === "ios" ? 0 : 60, // it suits the android
      },
      tabBarLabel: ({ color }) => (
        <Text style={{ fontSize: 14, color }}>{route.name}</Text>
      ),
    })}>
    {createTabScreen("Home", HelperHomeScreen, "home")}
    {createTabScreen(
      "Notifications",
      Notifications,
      "notifications",
      hasRequest
    )}
    {createTabScreen("Community", HelperCommunityScreen, "people")}
    {createTabScreen("Settings", SettingsScreen, "settings")}
  </MyTabs.Navigator>
));

const SettingsScreen = React.memo(() => {
  const { role } = useAuth();
  const Settings = role === "helper" ? HelperSettings : SekeerSettings;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerStyle: { shadowOpacity: 0, elevation: 0 },
        headerTitle: "",
        headerTintColor: Colors.MainColor,
      }}>
      <Stack.Screen name='SettingsScreen' component={Settings} />
      <Stack.Screen
        name='Account'
        component={Account}
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
      <Stack.Screen name='Language' component={Language} />
      <Stack.Screen name='VoiceControl' component={VoiceControl} />
    </Stack.Navigator>
  );
});

const HelperHomeScreen = React.memo(() => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name='HomeScreen' component={Home} />
    <Stack.Screen name='Instructions' component={Instructions} />
  </Stack.Navigator>
));

const HelperCommunityScreen = React.memo(() => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name='CommunityScreen' component={Community} />
    <Stack.Screen name='Article' component={Article} />
  </Stack.Navigator>
));

const Navigation = React.memo(({ hasRequest }) => {
  const { isAuthenticated, role, isNewUser } = useAuth();

  const MyTab = useMemo(() => {
    if (role === "seeker") {
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isNewUser && (
            <Stack.Screen name='Instructions' component={Instructions} />
          )}
          <Stack.Screen name='MyTabs' component={SeekerTap} />
        </Stack.Navigator>
      );
    }
    return <HelperTap hasRequest={hasRequest} />;
  }, [role, isNewUser]);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <SafeAreaView style={styles.safeAreaScreen}>{MyTab}</SafeAreaView>
      ) : (
        <UnAuthStack />
      )}
    </NavigationContainer>
  );
});

const Root = React.memo(() => {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { authenticate, handleRole, token } = useAuth();
  const { setUser } = useUser();
  const { setFriends } = useSeeker();
  const { setRequests, requests } = useHelper();

  let hasFriendRequests = requests.length > 0;

  useEffect(() => {
    async function fetchToken() {
      setIsTryingLogin(true);
      const [[, storedToken], [, storedRole]] = await AsyncStorage.multiGet([
        "token",
        "role",
      ]);

      console.log(storedRole, "  ", storedToken);

      if (storedToken) {
        authenticate(storedToken);
        handleRole(storedRole);

        try {
          const userData = await getUser(storedToken);
          setUser(userData.user);

          if (storedRole === "seeker") {
            const friendsData = await getFriends(storedToken);
            setFriends(friendsData.friends);
          } else {
            const friendRequests = await getFriendRequests(storedToken);
            setRequests(friendRequests.friendRequests);
          }
        } catch (error) {
          alert(error);
        }
      }

      setIsTryingLogin(false);
      setIsLoading(false);
    }

    fetchToken();
  }, [token]);

  if (isTryingLogin || isLoading) {
    return <AppLoading autoHideSplash />;
  }

  return <Navigation hasRequest={hasFriendRequests} />;
});

export default function App() {
  return (
    <>
      <StatusBar barStyle='default' />

      <AuthProvider>
        <UserProvider>
          <HelperProvider>
            <SeekerProvider>
              <Root />
            </SeekerProvider>
          </HelperProvider>
        </UserProvider>
      </AuthProvider>
    </>
  );
}

const styles = StyleSheet.create({
  safeAreaScreen: {
    flex: 1,
  },
  backTitle: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
  },
  notificationDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },
});
