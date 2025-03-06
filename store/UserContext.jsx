import { createContext, useState, useEffect, useContext } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser } from "../util/HttpUser";

export const UserContext = createContext({
  user: null,
  loading: true,
  setUser: () => {},
});

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userData = await getUser(token);
        setUser(userData.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='black' />
      </View>
    );
  }

  const value = {
    user,
    loading,
    setUser,
  };

  return (
    <UserContext.Provider value={value}>
      {user ? (
        children
      ) : (
        <View style={styles.container}>
          <Text>Failed to load user data.</Text>
        </View>
      )}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

const styles = {
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};

export default UserProvider;
