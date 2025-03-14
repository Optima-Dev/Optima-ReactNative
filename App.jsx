// importing react hooks
import React, { useEffect, useState, useCallback, useMemo } from "react";

// importing navigation
import { Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

// importing icons
import { Ionicons } from "@expo/vector-icons";

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
import Article from "./screens/Helper/Atricle";

// importing components
import BackButton from "./components/UI/BackButton";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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
      headerShown: false,
      contentStyle: { backgroundColor: Colors.MainColor },
      headerShadowVisible: false,
      headerStyle: {
        shadowOpacity: 0,
        elevation: 0,
      },
      headerTitle: "",
      headerTintColor: Colors.MainColor,
    }}>
    <Stack.Screen
      name='Splash'
      component={Splash}
      options={{
        headerShown: false,
        gestureEnabled: false,
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
));

const SeekerTap = React.memo(() => (
  <MyTabs.Navigator
    screenOptions={({ route }) => ({
      tabBarActiveTintColor: Colors.MainColor,
      headerShown: false,
      backgroundColor: "white",
      tabBarStyle: {
        height: Platform.OS === "ios" ? 0 : 60,
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: "#FFFFFF",
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
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
));

const HelperTap = React.memo(({ hasFriendRequests }) => (
  <MyTabs.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: Colors.MainColor,
      tabBarStyle: {
        height: Platform.OS === "ios" ? 0 : 60,
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: "#FFFFFF",
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
      },
      tabBarLabel: ({ color }) => (
        <Text style={{ fontSize: 12.5, color }}>{route.name}</Text>
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
          <View>
            <Ionicons
              name={`notifications${focused ? "" : "-outline"}`}
              size={28}
              color={color}
            />
            {hasFriendRequests && <View style={styles.notificationDot} />}
          </View>
        ),
      }}
    />
    <MyTabs.Screen
      name='Community'
      component={HelperCommunityScreen}
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
));

const SettingsScreen = React.memo(() => {
  const { role } = useAuth();
  const Settings = role === "helper" ? HelperSettings : SekeerSettings;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerStyle: {
          shadowOpacity: 0,
          elevation: 0,
        },
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

const Navigation = React.memo(({ hasFriendRequests }) => {
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
    return <HelperTap hasFriendRequests={hasFriendRequests} />;
  }, [role, isNewUser, hasFriendRequests]);

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
  const [hasFriendRequests, setHasFriendRequests] = useState(false);
  const { authenticate, handleRole, token } = useAuth();
  const { setUser } = useUser();
  const { setFriends } = useSeeker();
  const { setRequests } = useHelper();

  useEffect(() => {
    async function fetchToken() {
      setIsTryingLogin(true);
      const storedToken = await AsyncStorage.getItem("token");
      const storedRole = await AsyncStorage.getItem("role");

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
            setHasFriendRequests(friendRequests.friendRequests.length > 0);
          }
        } catch (error) {
          alert(error);
        }
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, [token]);

  if (isTryingLogin) {
    return <AppLoading />;
  }

  return <Navigation hasFriendRequests={hasFriendRequests} />;
});

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <HelperProvider>
          <SeekerProvider>
            <Root />
          </SeekerProvider>
        </HelperProvider>
      </UserProvider>
    </AuthProvider>
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
